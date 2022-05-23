import { useState } from 'react';
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

  const [showActionForm, setShowActionForm] = useState(
    /** @type {WorkspaceActionType} */ (undefined)
  );
  function closeActionForm() {
    setShowActionForm(undefined);
  }

  function handleCreate() {
    workspace.create(({ filter }) => handleFilterChange(filter));
  }
  function handleDuplicate() {
    workspace.duplicate(({ filter }) => handleFilterChange(filter));
  }
  /** @param {ExplorerFilterSet} loaded */
  function handleLoad(loaded) {
    filterSets.use(loaded.id);
    workspace.load(loaded);
    closeActionForm();
  }
  function handleRemove() {
    workspace.remove(({ filter }) => handleFilterChange(filter));
  }
  /** @param {string} id */
  function handleUse(id) {
    workspace.use(id, (used) => {
      filterSets.use(used.id);
      handleFilterChange(used.filter);
    });
  }

  /** @type {import('../../components/FilterDisplay').ClickCombineModeHandler} */
  function handleClickCombineMode(payload) {
    handleFilterChange(
      /** @type {import('../types').ExplorerFilter} */ ({
        ...workspace.active.filter,
        __combineMode: payload === 'AND' ? 'OR' : 'AND',
      })
    );
  }
  /** @type {import('../../components/FilterDisplay').ClickFilterHandler} */
  function handleCloseFilter(payload) {
    const { field, anchorField, anchorValue } = payload;
    const { filter } = workspace.active;
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
          disabled={checkIfFilterEmpty(workspace.active.filter)}
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
          const name = `#${i + 1}`;
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
                <h3>{name}</h3>
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
                <h3>{name}</h3>
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
