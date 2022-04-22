import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';
import './QueryDisplay.css';

/**
 * @param {Object} props
 * @param {import('../GuppyComponents/types').FilterState} props.filter
 * @param {import('../GuppyComponents/types').FilterConfig['info']} props.filterInfo
 * @param {'AND' | 'OR'} [props.combineMode]
 */
function QueryDisplay({ filter, filterInfo, combineMode }) {
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
            <QueryDisplay
              filter={value.filter}
              combineMode={__combineMode}
              filterInfo={filterInfo}
            />{' '}
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
    <span className='query-display'>
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

QueryDisplay.propTypes = {
  filter: PropTypes.any,
  filterInfo: PropTypes.objectOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
    })
  ),
  combineMode: PropTypes.oneOf(['AND', 'OR']),
};

export default QueryDisplay;
