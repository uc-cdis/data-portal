import { useEffect, useState } from 'react';
import FilterDisplay from '../../components/FilterDisplay';
import SimplePopup from '../../components/SimplePopup';
import { useExplorerConfig } from '../ExplorerConfigContext';
import { useExplorerState } from '../ExplorerStateContext';
import { useExplorerFilterSets } from '../ExplorerFilterSetsContext';
import { createEmptyFilterSet } from '../ExplorerFilterSet/utils';
import FilterSetOpenForm from '../ExplorerFilterSetForms/FilterSetOpenForm';
import useFilterSetWorkspace from './useFilterSetWorkspace';
import {
  checkIfFilterEmpty,
  findFilterSetIdInWorkspaceState,
  pluckFromAnchorFilter,
  pluckFromFilter,
} from './utils';
import './ExplorerFilterSetWorkspace.css';

/** @typedef {import('../types').ExplorerFilterSet} ExplorerFilterSet */
/** @typedef {import('./types').FilterSetWorkspaceAction['type']} WorkspaceActionType */

const emptyFilterSet = createEmptyFilterSet();

function ExplorerFilterSetWorkspace() {
  const filterInfo = useExplorerConfig().current.filterConfig.info;
  const { handleFilterChange } = useExplorerState();
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

  const [showActionForm, setShowActionForm] = useState(
    /** @type {WorkspaceActionType} */ (undefined)
  );
  function closeActionForm() {
    setShowActionForm(undefined);
  }

  function updateFilterSet(updated) {
    filterSets.use(updated.id);
    handleFilterChange(updated.filter);
  }
  function handleCreate() {
    workspace.create(updateFilterSet);
  }
  function handleDuplicate() {
    workspace.duplicate(updateFilterSet);
  }
  /** @param {ExplorerFilterSet} loaded */
  function handleLoad(loaded) {
    const foundId = findFilterSetIdInWorkspaceState(loaded.id, workspace.all);
    if (foundId !== undefined) {
      workspace.use(foundId, closeActionForm);
    } else {
      filterSets.use(loaded.id);
      const shouldOverwrite = checkIfFilterEmpty(
        workspace.active.filterSet.filter
      );
      workspace.load(loaded, shouldOverwrite, closeActionForm);
    }
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
    checkIfFilterEmpty(filter)
  );

  return (
    <div className='explorer-filter-set-workplace'>
      <header>
        <h2>Filter Set Workspace</h2>
        <button
          className='explorer-filter-set-workplace__action-button'
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
          className='explorer-filter-set-workplace__action-button'
          type='button'
          onClick={handleDuplicate}
          disabled={checkIfFilterEmpty(
            (workspace.active.filterSet ?? emptyFilterSet).filter
          )}
        >
          Duplicate
        </button>
        <button
          className='explorer-filter-set-workplace__action-button'
          type='button'
          onClick={() => setShowActionForm('LOAD')}
          disabled={filterSets.all.length < 1}
        >
          Load
        </button>
        <button
          className='explorer-filter-set-workplace__action-button'
          type='button'
          onClick={handleRemove}
          disabled={workspace.size < 2}
        >
          Remove
        </button>
      </header>
      <main>
        {Object.keys(workspace.all).map((id, i) => {
          const filterSet = workspace.all[id];
          const name = 'name' in filterSet ? filterSet.name : undefined;
          return workspace.active.id === id ? (
            <div
              className='explorer-filter-set-workplace__query explorer-filter-set-workplace__query--active'
              key={id}
            >
              <header>
                <button
                  className='explorer-filter-set-workplace__action-button'
                  type='button'
                  disabled
                >
                  Active
                </button>
                <h3 title={name}>
                  #{i + 1} {name}
                </h3>
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
            <div className='explorer-filter-set-workplace__query' key={id}>
              <header>
                <button
                  className='explorer-filter-set-workplace__action-button'
                  type='button'
                  onClick={() => handleUse(id)}
                >
                  Use
                </button>
                <h3 title={name}>
                  #{i + 1} {name}
                </h3>
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
      {showActionForm !== undefined && (
        <SimplePopup>
          {showActionForm === 'LOAD' && (
            <FilterSetOpenForm
              currentFilterSet={filterSets.active ?? emptyFilterSet}
              filterSets={filterSets.all}
              onAction={handleLoad}
              onClose={closeActionForm}
            />
          )}
        </SimplePopup>
      )}
    </div>
  );
}

export default ExplorerFilterSetWorkspace;
