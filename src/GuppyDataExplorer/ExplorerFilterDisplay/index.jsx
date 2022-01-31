import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';
import './ExplorerFilterDisplay.css';

/**
 * @typedef {Object} FilterDisplayProps
 * @property {import('../types').ExplorerFilters} filter
 * @property {import('../types').FilterConfig['info']} filterInfo
 */

/** @param {FilterDisplayProps} props */
function FilterDisplay({ filter, filterInfo }) {
  const filterElements = /** @type {JSX.Element[]} */ ([]);
  for (const [key, value] of Object.entries(filter))
    if ('filter' in value) {
      const [anchorKey, anchorValue] = key.split(':');
      filterElements.push(
        <span key={key} className='pill anchor'>
          <span className='token field'>
            With <code>{filterInfo[anchorKey].label}</code> of{' '}
            <code>{`"${anchorValue}"`}</code>
          </span>
          <span className='token'>
            ( <FilterDisplay filter={value.filter} filterInfo={filterInfo} /> )
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
    <>
      {filterElements.map((filterElement, i) => (
        <>
          {filterElement}
          {i < filterElements.length - 1 && <span className='pill'>AND</span>}
        </>
      ))}
    </>
  );
}

FilterDisplay.propTypes = {
  filter: PropTypes.any,
  filterInfo: PropTypes.any,
};

/** @param {FilterDisplayProps} props */
function ExplorerFilterDisplay({ filter, filterInfo }) {
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
      className={`explorer-filter-info ${
        isCollapsed ? 'explorer-filter-info__collapsed' : ''
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
          <FilterDisplay filter={filter} filterInfo={filterInfo} />
        </>
      ) : (
        <h4>← Try Filters to explore data</h4>
      )}
    </div>
  );
}

ExplorerFilterDisplay.propTypes = FilterDisplay.propTypes;

export default ExplorerFilterDisplay;
