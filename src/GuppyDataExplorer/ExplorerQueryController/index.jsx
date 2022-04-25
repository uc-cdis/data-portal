import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import QueryDisplay from '../../components/QueryDisplay';
import { useExplorerConfig } from '../ExplorerConfigContext';
import { useExplorerState } from '../ExplorerStateContext';
import './ExplorerQueryController.css';

/** @param {{ filter: import('../types').ExplorerFilters }} props */
function ExplorerQueryController({ filter }) {
  const filterInfo = useExplorerConfig().current.filterConfig.info;
  const { updateFilters } = useExplorerState();

  /** @param {import('../../components/QueryDisplay').QueryDisplayAction} action */
  function handleQueryDisplayAction({ type, payload }) {
    switch (type) {
      case 'clickCombineMode': {
        const newCombineMode = payload === 'AND' ? 'OR' : 'AND';
        updateFilters({ ...filter, __combineMode: newCombineMode });
        break;
      }
      case 'clickFilter': {
        const { filterKey, anchorKey, anchorValue } = payload;
        const newFilters = {};
        if (anchorKey !== undefined && anchorValue !== undefined) {
          const anchor = `${anchorKey}:${anchorValue}`;
          for (const [key, value] of Object.entries(filter))
            if (key !== anchor) newFilters[key] = value;
            else if (typeof value === 'object' && 'filter' in value) {
              const newAnchorValue = {};
              for (const [aKey, aValue] of Object.entries(value.filter))
                if (aKey !== filterKey) newAnchorValue[aKey] = aValue;

              if (Object.keys(newAnchorValue).length > 0)
                newFilters[key] = { filter: newAnchorValue };
            }
        } else {
          for (const [key, value] of Object.entries(filter))
            if (key !== filterKey) newFilters[key] = value;
        }
        updateFilters(newFilters);
        break;
      }
      default:
        break;
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
  return (
    <div
      ref={ref}
      className={`explorer-query-controller ${
        isCollapsed ? 'explorer-query-controller__collapsed' : ''
      }`.trim()}
    >
      {Object.keys(filter).length > 0 ? (
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
            onAction={handleQueryDisplayAction}
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
