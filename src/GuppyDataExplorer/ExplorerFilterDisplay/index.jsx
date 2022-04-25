import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import 'rc-tooltip/assets/bootstrap_white.css';
import QueryDisplay from '../../components/QueryDisplay';
import { useExplorerConfig } from '../ExplorerConfigContext';
import './ExplorerFilterDisplay.css';

/** @param {{ filter: import('../types').ExplorerFilters }} props */
function ExplorerFilterDisplay({ filter }) {
  const filterInfo = useExplorerConfig().current.filterConfig.info;
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
      className={`explorer-filter-display ${
        isCollapsed ? 'explorer-filter-display__collapsed' : ''
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
          <QueryDisplay filter={filter} filterInfo={filterInfo} />
        </>
      ) : (
        <h4>← Try Filters to explore data</h4>
      )}
    </div>
  );
}

ExplorerFilterDisplay.propTypes = {
  filter: PropTypes.any,
};

export default ExplorerFilterDisplay;
