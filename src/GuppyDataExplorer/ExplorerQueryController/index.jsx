import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import QueryDisplay from '../../components/QueryDisplay';
import { useExplorerConfig } from '../ExplorerConfigContext';
import { useExplorerState } from '../ExplorerStateContext';
import { pluckFromAnchorFilter, pluckFromFilter } from './utils';
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

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current?.offsetHeight < ref.current?.scrollHeight) {
      if (!isOverflowing) setIsOverflowing(true);
    } else if (isOverflowing) {
      setIsOverflowing(false);
    }
  });

  const hasFilter =
    Object.keys(pluckFromFilter({ field: '__combineMode', filter })).length > 0;
  return (
    <div className='explorer-query-controller'>
      <div
        ref={ref}
        className={`explorer-query-controller__query ${
          isCollapsed ? 'explorer-query-controller__query--collapsed' : ''
        }`.trim()}
      >
        {hasFilter ? (
          <>
            <button
              type='button'
              onClick={() => setIsCollapsed((s) => !s)}
              disabled={isCollapsed && !isOverflowing}
            >
              <i
                className={`g3-icon g3-icon--sm g3-icon--chevron-${
                  isCollapsed ? 'right' : 'down'
                }`}
              />
            </button>
            <h4>Filters in Use:</h4>
            <QueryDisplay
              filter={filter}
              filterInfo={filterInfo}
              onClickCombineMode={handleClickCombineMode}
              onCloseFilter={handleCloseFilter}
            />
          </>
        ) : (
          <h4>← Try Filters to explore data</h4>
        )}
      </div>
    </div>
  );
}

ExplorerQueryController.propTypes = {
  filter: PropTypes.any,
};

export default ExplorerQueryController;
