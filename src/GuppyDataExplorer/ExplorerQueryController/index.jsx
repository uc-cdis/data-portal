import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import QueryDisplay from '../../components/QueryDisplay';
import { useExplorerConfig } from '../ExplorerConfigContext';
import { useExplorerState } from '../ExplorerStateContext';
import { pluckFromAnchorFilter, pluckFromFilter } from './utils';
import './ExplorerQueryController.css';

/** @param {{ filter: import('../types').ExplorerFilters }} props */
function ExplorerQueryController({ filter }) {
  const filterInfo = useExplorerConfig().current.filterConfig.info;
  const { updateFilters } = useExplorerState();

  /** @type {import('../../components/QueryDisplay').ClickCombineModeHandler} */
  function handleClickCombineMode(payload) {
    const newCombineMode = payload === 'AND' ? 'OR' : 'AND';
    updateFilters({ ...filter, __combineMode: newCombineMode });
  }
  /** @type {import('../../components/QueryDisplay').ClickFilterHandler} */
  function handleClickFilter(payload) {
    const { filterKey, anchorKey, anchorValue } = payload;
    if (anchorKey !== undefined && anchorValue !== undefined) {
      const anchor = `${anchorKey}:${anchorValue}`;
      updateFilters(pluckFromAnchorFilter({ anchor, filter, filterKey }));
    } else {
      updateFilters(pluckFromFilter({ filter, filterKey }));
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
    Object.keys(pluckFromFilter({ filter, filterKey: '__combineMode' }))
      .length > 0;
  return (
    <div
      ref={ref}
      className={`explorer-query-controller ${
        isCollapsed ? 'explorer-query-controller__collapsed' : ''
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
            onClickFilter={handleClickFilter}
          />
        </>
      ) : (
        <h4>← Try Filters to explore data</h4>
      )}
    </div>
  );
}

ExplorerQueryController.propTypes = {
  filter: PropTypes.any,
};

export default ExplorerQueryController;
