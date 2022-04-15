import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';
import { useExplorerConfig } from '../ExplorerConfigContext';
import './ExplorerFilterDisplay.css';

/**
 * @param {Object} props
 * @param {import('../types').ExplorerFilters} props.filter
 * @param {'AND' | 'OR'} [props.combineMode]
 */
export function FilterDisplay({ filter, combineMode }) {
  const filterInfo = useExplorerConfig().current.filterConfig.info;
  const filterElements = /** @type {JSX.Element[]} */ ([]);
  const { __combineMode, ...__filter } = filter;
  for (const [key, value] of Object.entries(__filter))
    if ('filter' in value) {
      const [anchorKey, anchorValue] = key.split(':');
      filterElements.push(
        <span key={key} className='pill anchor'>
          <span className='token field'>
            With <code>{filterInfo[anchorKey].label}</code> of{' '}
            <code>{`"${anchorValue}"`}</code>
          </span>
          <span className='token'>
            ({' '}
            <FilterDisplay filter={value.filter} combineMode={__combineMode} />{' '}
            )
          </span>
        </span>
      );
    } else if ('selectedValues' in value) {
      filterElements.push(
        <span key={key} className='pill'>
          <span className='token'>
            <code>{filterInfo[key].label}</code>{' '}
            {value.selectedValues.length > 1 ? 'is any of ' : 'is '}
          </span>
          <span className='token'>
            {value.selectedValues.length > 1 ? (
              <Tooltip
                arrowContent={<div className='rc-tooltip-arrow-inner' />}
                overlay={value.selectedValues.map((v) => `"${v}"`).join(', ')}
                placement='bottom'
                trigger={['hover', 'focus']}
              >
                <span>
                  <code>{`"${value.selectedValues[0]}"`}</code>, ...
                </span>
              </Tooltip>
            ) : (
              <code>{`"${value.selectedValues[0]}"`}</code>
            )}
          </span>
        </span>
      );
    } else {
      filterElements.push(
        <span key={key} className='pill'>
          <span className='token'>
            <code>{filterInfo[key].label}</code> is between
          </span>
          <span className='token'>
            <code>
              ({value.lowerBound}, {value.upperBound})
            </code>
          </span>
        </span>
      );
    }

  return (
    <span className='filter-display'>
      {filterElements.map((filterElement, i) => (
        <>
          {filterElement}
          {i < filterElements.length - 1 && (
            <span className='pill'>
              {combineMode ?? __combineMode ?? 'AND'}
            </span>
          )}
        </>
      ))}
    </span>
  );
}

FilterDisplay.propTypes = {
  filter: PropTypes.any,
};

/** @param {{ filter: import('../types').ExplorerFilters }} props */
function ExplorerFilterDisplay({ filter }) {
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
          <FilterDisplay filter={filter} />
        </>
      ) : (
        <h4>← Try Filters to explore data</h4>
      )}
    </div>
  );
}

ExplorerFilterDisplay.propTypes = FilterDisplay.propTypes;

export default ExplorerFilterDisplay;
