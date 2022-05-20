import FilterDisplay from '../../components/FilterDisplay';
import { useExplorerConfig } from '../ExplorerConfigContext';
import { useExplorerState } from '../ExplorerStateContext';
import useFilterSetWorkspace from './useFilterSetWorkspace';
import {
  checkIfFilterEmpty,
  pluckFromAnchorFilter,
  pluckFromFilter,
} from './utils';
import './ExplorerFilterSetWorkspace.css';

function ExplorerFilterSetWorkspace() {
  const filterInfo = useExplorerConfig().current.filterConfig.info;
  const { handleFilterChange } = useExplorerState();
  const workspace = useFilterSetWorkspace();

  function handleCreate() {
    workspace.create(handleFilterChange);
  }
  function handleDuplicate() {
    workspace.duplicate(handleFilterChange);
  }
  function handleRemove() {
    workspace.remove(handleFilterChange);
  }
  /** @param {string} id */
  function handleUse(id) {
    workspace.use(id, handleFilterChange);
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
    </div>
  );
}

export default ExplorerFilterSetWorkspace;
