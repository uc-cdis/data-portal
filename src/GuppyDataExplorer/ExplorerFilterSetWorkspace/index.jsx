import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import FilterDisplay from '../../components/FilterDisplay';
import SimplePopup from '../../components/SimplePopup';
import { contactEmail } from '../../localconf';
import { updateExplorerFilter } from '../../redux/explorer/slice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
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
  const dispatch = useAppDispatch();
  /** @param {import('../types').ExplorerFilter} filter */
  function handleFilterChange(filter) {
    dispatch(updateExplorerFilter(filter));
  }
  const filterInfo = useAppSelector(
    (state) => state.explorer.config.filterConfig.info
  );
  const filterSets = useExplorerFilterSets();
  const workspace = useFilterSetWorkspace();

  const [actionFormType, setActionFormType] = useState(
    /** @type {ActionFormType} */ (undefined)
  );
  function closeActionForm() {
    setActionFormType(undefined);
  }

  function handleClear() {
    workspace.clear();
  }
  function handleClearAll() {
    workspace.clearAll();
    closeActionForm();
  }
  function handleCreate() {
    workspace.create();
  }
  /** @param {ExplorerFilterSet} deleted */
  async function handleDelete(deleted) {
    try {
      await filterSets.delete(deleted);
      await filterSets.refresh();
      workspace.remove();
    } finally {
      closeActionForm();
    }
  }
  function handleDuplicate() {
    workspace.duplicate();
  }
  /** @param {ExplorerFilterSet} loaded */
  function handleLoad(loaded) {
    const foundId = findFilterSetIdInWorkspaceState(loaded.id, workspace);
    if (foundId !== undefined) {
      workspace.use(foundId);
    } else {
      const shouldOverwrite = checkIfFilterEmpty(
        workspace.active.filterSet.filter
      );
      workspace.load(loaded, shouldOverwrite);
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
      workspace.load(filterSet, true);
    } finally {
      closeActionForm();
    }
  }
  function handleReset() {
    handleFilterChange(filterSets.active.filter);
  }
  function handleRemove() {
    workspace.remove();
  }
  /** @param {string} id */
  function handleUse(id) {
    workspace.use(id);
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
              <a href={contactEmail}>{contactEmail}</a>) for more information.
            </p>
          </div>
        ) : (
          <>
            <div className='explorer-filter-set-workspace__action-button-group'>
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
                onClick={handleRemove}
                disabled={workspace.size < 2}
              >
                Remove
              </button>
              <button
                className='explorer-filter-set-workspace__action-button'
                type='button'
                onClick={handleClear}
                disabled={checkIfFilterEmpty(
                  (workspace.active.filterSet ?? filterSets.empty).filter
                )}
              >
                Clear
              </button>
              <button
                className='explorer-filter-set-workspace__action-button'
                type='button'
                onClick={() => setActionFormType('CLEAR-ALL')}
                disabled={Object.keys(workspace.all).length < 2}
              >
                Clear all
              </button>
            </div>
            <div className='explorer-filter-set-workspace__action-button-group'>
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
                onClick={() => setActionFormType('DELETE')}
                disabled={
                  !('id' in (workspace.active.filterSet ?? filterSets.empty))
                }
              >
                Delete
              </button>
            </div>
          </>
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
            filterSets={filterSets}
            handlers={{
              clearAll: handleClearAll,
              close: closeActionForm,
              delete: handleDelete,
              load: handleLoad,
              save: handleSave,
            }}
            type={actionFormType}
            workspace={workspace}
          />
        </SimplePopup>
      )}
    </div>
  );
}

export default ExplorerFilterSetWorkspace;
