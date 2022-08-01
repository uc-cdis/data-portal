import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import FilterDisplay from '../../components/FilterDisplay';
import SimplePopup from '../../components/SimplePopup';
import { contactEmail } from '../../localconf';
import {
  createFilterSet,
  deleteFilterSet,
  fetchFilterSets,
  updateFilterSet,
} from '../../redux/explorer/asyncThunks';
import { updateExplorerFilter } from '../../redux/explorer/slice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import FilterSetActionForm from './FilterSetActionForm';
import FilterSetLabel from './FilterSetLabel';
import useFilterSetWorkspace from './useFilterSetWorkspace';
import {
  checkIfFilterEmpty,
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
  const savedFilterSets = useAppSelector(
    (state) => state.explorer.savedFilterSets
  );
  const workspace = useFilterSetWorkspace();
  const activeFilterSet = workspace.all[workspace.activeId];
  const activeSavedFilterSet = savedFilterSets.data.find(
    ({ id }) => id === activeFilterSet.id
  );

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
      await dispatch(deleteFilterSet(deleted));
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
    let newActiveId;
    for (const [id, filterSet] of Object.entries(workspace.all))
      if (filterSet.id === loaded.id) {
        newActiveId = id;
        break;
      }

    if (newActiveId) workspace.use(newActiveId);
    else workspace.load(loaded);

    closeActionForm();
  }
  /** @param {ExplorerFilterSet} saved */
  async function handleSave(saved) {
    try {
      if (saved.id === undefined) await dispatch(createFilterSet(saved));
      else await dispatch(updateFilterSet(saved));
    } finally {
      closeActionForm();
    }
  }
  function handleReset() {
    handleFilterChange(activeSavedFilterSet.filter);
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
        ...activeFilterSet.filter,
        __combineMode: payload === 'AND' ? 'OR' : 'AND',
      })
    );
  }
  /** @type {import('../../components/FilterDisplay').ClickFilterHandler} */
  function handleCloseFilter(payload) {
    const { field, anchorField, anchorValue } = payload;
    const { filter } = activeFilterSet;
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
        {savedFilterSets.isError ? (
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
                onClick={() =>
                  dispatch(fetchFilterSets()).unwrap().catch(console.error)
                }
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
                disabled={checkIfFilterEmpty(activeFilterSet?.filter ?? {})}
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
                disabled={checkIfFilterEmpty(activeFilterSet?.filter ?? {})}
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
                disabled={savedFilterSets.data.length < 1}
              >
                Load
              </button>
              <button
                className='explorer-filter-set-workspace__action-button'
                type='button'
                onClick={() => setActionFormType('SAVE')}
                disabled={checkIfFilterEmpty(activeFilterSet?.filter ?? {})}
              >
                Save
              </button>
              <button
                className='explorer-filter-set-workspace__action-button'
                type='button'
                onClick={handleReset}
                disabled={
                  activeSavedFilterSet === undefined ||
                  JSON.stringify(activeSavedFilterSet.filter) ===
                    JSON.stringify(activeFilterSet.filter)
                }
              >
                Reset
              </button>
              <button
                className='explorer-filter-set-workspace__action-button'
                type='button'
                onClick={() => setActionFormType('DELETE')}
                disabled={!('id' in (workspace.all[workspace.activeId] ?? {}))}
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
          return workspace.activeId === id ? (
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
            currentFilter={activeFilterSet?.filter ?? {}}
            filterSets={{
              active: activeSavedFilterSet,
              all: savedFilterSets.data,
              empty: { name: '', description: '', filter: {} },
            }}
            handlers={{
              clearAll: handleClearAll,
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
