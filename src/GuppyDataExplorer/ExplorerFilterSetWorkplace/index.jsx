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

  const disableNew = Object.values(workspace.all).some(checkIfFilterEmpty);

  return (
    <div className='explorer-filter-set-workplace'>
      <header>
        <button
          className='explorer-filter-set-workplace__action-button'
          type='button'
          onClick={() => workspace.create(handleFilterChange)}
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
          onClick={() => workspace.duplicate(handleFilterChange)}
          disabled={checkIfFilterEmpty(workspace.active.filter)}
        >
          Duplicate
        </button>
        <button
          className='explorer-filter-set-workplace__action-button'
          type='button'
          onClick={() => workspace.remove(handleFilterChange)}
          disabled={workspace.size < 2}
        >
          Remove
        </button>
      </header>
      <main>
        {Object.keys(workspace.all).map((id, i) => {
          const _filter = workspace.all[id];
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
                <h3>{`#${i + 1}`}</h3>
              </header>
              <main>
                {checkIfFilterEmpty(_filter) ? (
                  <h4>Try Filters to explore data</h4>
                ) : (
                  <FilterDisplay
                    filter={_filter}
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
                  onClick={() => workspace.use(id, handleFilterChange)}
                >
                  Use
                </button>
                <h3>{`#${i + 1}`}</h3>
              </header>
              <main>
                {checkIfFilterEmpty(_filter) ? (
                  <h4>Try Filters to explore data</h4>
                ) : (
                  <FilterDisplay filter={_filter} filterInfo={filterInfo} />
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
