import PropTypes from 'prop-types';
import { useEffect } from 'react';
import QueryDisplay from '../../components/QueryDisplay';
import { useExplorerConfig } from '../ExplorerConfigContext';
import { useExplorerState } from '../ExplorerStateContext';
import useQueryState from './useQueryState';
import {
  checkIfFilterEmpty,
  pluckFromAnchorFilter,
  pluckFromFilter,
} from './utils';
import './ExplorerQueryController.css';

/** @typedef {import('../types').ExplorerFilter} ExplorerFilter */

/** @param {{ filter: ExplorerFilter }} props */
function ExplorerQueryController({ filter }) {
  const filterInfo = useExplorerConfig().current.filterConfig.info;
  const { handleFilterChange } = useExplorerState();

  /** @type {import('../../components/QueryDisplay').ClickCombineModeHandler} */
  function handleClickCombineMode(payload) {
    handleFilterChange(
      /** @type {ExplorerFilter} */ ({
        ...filter,
        __combineMode: payload === 'AND' ? 'OR' : 'AND',
      })
    );
  }
  /** @type {import('../../components/QueryDisplay').ClickFilterHandler} */
  function handleCloseFilter(payload) {
    const { field, anchorField, anchorValue } = payload;
    if (anchorField !== undefined && anchorValue !== undefined) {
      const anchor = `${anchorField}:${anchorValue}`;
      handleFilterChange(pluckFromAnchorFilter({ anchor, field, filter }));
    } else {
      handleFilterChange(pluckFromFilter({ field, filter }));
    }
  }

  const queryState = useQueryState(filter);
  useEffect(() => {
    queryState.update(filter);
  }, [filter]);

  const disableNew = Object.values(queryState.all).some(checkIfFilterEmpty);

  return (
    <div className='explorer-query-controller'>
      <header>
        <button
          className='explorer-query-controller__action-button'
          type='button'
          onClick={() => queryState.create(handleFilterChange)}
          disabled={disableNew}
          title={disableNew && 'No new query if queries without filter exist'}
        >
          New
        </button>
        <button
          className='explorer-query-controller__action-button'
          type='button'
          onClick={() => queryState.duplicate(handleFilterChange)}
          disabled={checkIfFilterEmpty(queryState.current.filter)}
        >
          Duplicate
        </button>
        <button
          className='explorer-query-controller__action-button'
          type='button'
          onClick={() => queryState.remove(handleFilterChange)}
          disabled={queryState.size < 2}
        >
          Remove
        </button>
      </header>
      <main>
        {Object.keys(queryState.all).map((id, i) => {
          const queryFilter = queryState.all[id];
          return queryState.current.id === id ? (
            <div
              className='explorer-query-controller__query explorer-query-controller__query--active'
              key={id}
            >
              <header>
                <button
                  className='explorer-query-controller__action-button'
                  type='button'
                  disabled
                >
                  Active
                </button>
                <h3>{`#${i + 1}`}</h3>
              </header>
              <main>
                {checkIfFilterEmpty(queryFilter) ? (
                  <h4>Try Filters to explore data</h4>
                ) : (
                  <QueryDisplay
                    filter={queryFilter}
                    filterInfo={filterInfo}
                    onClickCombineMode={handleClickCombineMode}
                    onCloseFilter={handleCloseFilter}
                  />
                )}
              </main>
            </div>
          ) : (
            <div className='explorer-query-controller__query' key={id}>
              <header>
                <button
                  className='explorer-query-controller__action-button'
                  type='button'
                  onClick={() => queryState.use(id, handleFilterChange)}
                >
                  Use
                </button>
                <h3>{`#${i + 1}`}</h3>
              </header>
              <main>
                {checkIfFilterEmpty(queryFilter) ? (
                  <h4>Try Filters to explore data</h4>
                ) : (
                  <QueryDisplay filter={queryFilter} filterInfo={filterInfo} />
                )}
              </main>
            </div>
          );
        })}
      </main>
    </div>
  );
}

ExplorerQueryController.propTypes = {
  filter: PropTypes.any,
};

export default ExplorerQueryController;
