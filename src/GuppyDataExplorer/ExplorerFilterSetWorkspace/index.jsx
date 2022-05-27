import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import FilterDisplay from '../../components/FilterDisplay';
import SimplePopup from '../../components/SimplePopup';
import { useExplorerConfig } from '../ExplorerConfigContext';
import { useExplorerState } from '../ExplorerStateContext';
import { useExplorerFilterSets } from '../ExplorerFilterSetsContext';
import FilterSetActionForm from './FilterSetActionForm';
import FilterSetLabel from './FilterSetLabel';
import useFilterSetWorkspace from './useFilterSetWorkspace';
import {
  checkIfFilterEmpty,
  findFilterSetIdInWorkspaceState,
  pluckFromAnchorFilter,
  pluckFromFilter,
} from './utils';
import './ExplorerFilterSetWorkspace.css';

/** @typedef {import('../types').ExplorerFilterSet} ExplorerFilterSet */
/** @typedef {import('./FilterSetActionForm').ActionFormType} ActionFormType */

function ExplorerFilterSetWorkspace() {
  const filterInfo = useExplorerConfig().current.filterConfig.info;
  const { handleFilterChange, handleFilterClear } = useExplorerState();
  const filterSets = useExplorerFilterSets();
  const workspace = useFilterSetWorkspace();
  useEffect(() => {
    const activeFilterSetId = workspace.active.filterSet.id;
    if (activeFilterSetId !== undefined) filterSets.use(activeFilterSetId);
  }, []);
  useEffect(() => {
    if (filterSets.active?.id !== undefined)
      workspace.load(filterSets.active, true);
  }, [filterSets.active]);

  const [actionFormType, setActionFormType] = useState(
    /** @type {ActionFormType} */ (undefined)
  );
  function closeActionForm() {
    setActionFormType(undefined);
  }

  function updateFilterSet(updated) {
    filterSets.use(updated.id);
    handleFilterChange(updated.filter);
  }
  function handleClearAll() {
    workspace.clear(updateFilterSet);
  }
  function handleCreate() {
    workspace.create(updateFilterSet);
  }
  /** @param {ExplorerFilterSet} deleted */
  async function handleDelete(deleted) {
    try {
      await filterSets.delete(deleted);
      await filterSets.refresh();
      workspace.remove(updateFilterSet);
    } finally {
      closeActionForm();
    }
  }
  function handleDuplicate() {
    workspace.duplicate(({ id }) => filterSets.use(id));
  }
  /** @param {ExplorerFilterSet} loaded */
  function handleLoad(loaded) {
    const foundId = findFilterSetIdInWorkspaceState(loaded.id, workspace.all);
    if (foundId !== undefined) {
      workspace.use(foundId, updateFilterSet);
    } else {
      const shouldOverwrite = checkIfFilterEmpty(
        workspace.active.filterSet.filter
      );
      workspace.load(loaded, shouldOverwrite, updateFilterSet);
    }
    closeActionForm();
  }
  /** @param {ExplorerFilterSet} saved */
  async function handleSave(saved) {
    try {
      let filterSet = saved;
      if (saved.id === undefined) filterSet = await filterSets.create(saved);
      else await filterSets.update(saved);

      await filterSets.refresh();
      workspace.load(filterSet, true, updateFilterSet);
    } finally {
      closeActionForm();
    }
  }
  function handleReset() {
    handleFilterChange(filterSets.active.filter);
  }
  function handleRemove() {
    workspace.remove(updateFilterSet);
  }
  /** @param {string} id */
  function handleUse(id) {
    workspace.use(id, updateFilterSet);
  }

  /** @type {import('../../components/FilterDisplay').ClickCombineModeHandler} */
  function handleClickCombineMode(payload) {
    handleFilterChange(
      /** @type {import('../types').ExplorerFilter} */ ({
        ...workspace.active.filterSet.filter,
        __combineMode: payload === 'AND' ? 'OR' : 'AND',
      })
    );
  }
  /** @type {import('../../components/FilterDisplay').ClickFilterHandler} */
  function handleCloseFilter(payload) {
    const { field, anchorField, anchorValue } = payload;
    const { filter } = workspace.active.filterSet;
    if (anchorField !== undefined && anchorValue !== undefined) {
      const anchor = `${anchorField}:${anchorValue}`;
      handleFilterChange(pluckFromAnchorFilter({ anchor, field, filter }));
    } else {
      handleFilterChange(pluckFromFilter({ field, filter }));
    }
  }

  const disableNew = Object.values(workspace.all).some(({ filter }) =>
    checkIfFilterEmpty(filter ?? {})
  );

  return (
    <div className='explorer-filter-set-workspace'>
      <header>
        <h2>Filter Set Workspace</h2>
        {filterSets.isError ? (
          <div className='explorer-filter-set-workspace__error'>
            <p>
              <FontAwesomeIcon
                className='screen-size-warning__icon'
                icon='triangle-exclamation'
                color='var(--pcdc-color__secondary)'
              />
              Error obtaining saved Filter Set data...
              <button
                className='explorer-filter-set-workspace__action-button'
                type='button'
                onClick={() => filterSets.refresh()}
              >
                Retry
              </button>
            </p>
            <p>
              If the problem persists, please contact the administrator (
              <a href='mailto:pcdc_help@lists.uchicago.edu'>
                pcdc_help@lists.uchicago.edu
              </a>
              ) for more information.
            </p>
          </div>
        ) : (
          <div>
            <button
              className='explorer-filter-set-workspace__action-button'
              type='button'
              onClick={handleCreate}
              disabled={disableNew}
              title={
                disableNew
                  ? 'No new query if queries without filter exist'
                  : undefined
              }
            >
              New
            </button>
            <button
              className='explorer-filter-set-workspace__action-button'
              type='button'
              onClick={handleDuplicate}
              disabled={checkIfFilterEmpty(
                (workspace.active.filterSet ?? filterSets.empty).filter
              )}
            >
              Duplicate
            </button>
            <button
              className='explorer-filter-set-workspace__action-button'
              type='button'
              onClick={() => setActionFormType('LOAD')}
              disabled={filterSets.all.length < 1}
            >
              Load
            </button>
            <button
              className='explorer-filter-set-workspace__action-button'
              type='button'
              onClick={() => setActionFormType('SAVE')}
              disabled={checkIfFilterEmpty(
                (workspace.active.filterSet ?? filterSets.empty).filter
              )}
            >
              Save
            </button>
            <button
              className='explorer-filter-set-workspace__action-button'
              type='button'
              onClick={handleReset}
              disabled={
                filterSets.active === undefined ||
                JSON.stringify(filterSets.active.filter) ===
                  JSON.stringify(workspace.active.filterSet.filter)
              }
            >
              Reset
            </button>
            <button
              className='explorer-filter-set-workspace__action-button'
              type='button'
              onClick={handleFilterClear}
              disabled={checkIfFilterEmpty(
                (workspace.active.filterSet ?? filterSets.empty).filter
              )}
            >
              Clear
            </button>
            <button
              className='explorer-filter-set-workspace__action-button'
              type='button'
              onClick={handleClearAll}
              disabled={Object.keys(workspace.all).length < 2}
            >
              Clear all
            </button>
            <button
              className='explorer-filter-set-workspace__action-button'
              type='button'
              onClick={() => setActionFormType('DELETE')}
              disabled={
                !('id' in (workspace.active.filterSet ?? filterSets.empty))
              }
            >
              Delete
            </button>
            <button
              className='explorer-filter-set-workspace__action-button'
              type='button'
              onClick={handleRemove}
              disabled={workspace.size < 2}
            >
              Remove
            </button>
          </div>
        )}
      </header>
      <main>
        {Object.keys(workspace.all).map((id, i) => {
          const filterSet = workspace.all[id];
          return workspace.active.id === id ? (
            <div
              className='explorer-filter-set-workspace__query explorer-filter-set-workspace__query--active'
              key={id}
            >
              <header>
                <button
                  className='explorer-filter-set-workspace__action-button'
                  type='button'
                  disabled
                >
                  Active
                </button>
                <FilterSetLabel filterSet={filterSet} index={i + 1} />
              </header>
              <main>
                {checkIfFilterEmpty(filterSet.filter) ? (
                  <h4>Try Filters to explore data</h4>
                ) : (
                  <FilterDisplay
                    filter={filterSet.filter}
                    filterInfo={filterInfo}
                    onClickCombineMode={handleClickCombineMode}
                    onCloseFilter={handleCloseFilter}
                  />
                )}
              </main>
            </div>
          ) : (
            <div className='explorer-filter-set-workspace__query' key={id}>
              <header>
                <button
                  className='explorer-filter-set-workspace__action-button'
                  type='button'
                  onClick={() => handleUse(id)}
                >
                  Use
                </button>
                <FilterSetLabel filterSet={filterSet} index={i + 1} />
              </header>
              <main>
                {checkIfFilterEmpty(filterSet.filter) ? (
                  <h4>Try Filters to explore data</h4>
                ) : (
                  <FilterDisplay
                    filter={filterSet.filter}
                    filterInfo={filterInfo}
                  />
                )}
              </main>
            </div>
          );
        })}
      </main>
      {actionFormType !== undefined && (
        <SimplePopup>
          <FilterSetActionForm
            handlers={{
              close: closeActionForm,
              delete: handleDelete,
              load: handleLoad,
              save: handleSave,
            }}
            type={actionFormType}
          />
        </SimplePopup>
      )}
    </div>
  );
}

export default ExplorerFilterSetWorkspace;
