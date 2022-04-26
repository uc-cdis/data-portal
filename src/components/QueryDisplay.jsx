import { Fragment } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';
import './QueryDisplay.css';

/**
 * @callback ClickCombineModeHandler
 * @param {'AND' | 'OR'} payload
 */
/**
 * @callback ClickFilterHandler
 * @param {{ anchorField?: string; anchorValue?: string; field: string }} payload
 */

/**
 * @param {Object} props
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 * @param {string} [props.filterKey]
 * @param {React.EventHandler<any>} [props.onClick]
 */
function QueryPill({ className = 'pill', children, filterKey, onClick }) {
  return typeof onClick === 'function' ? (
    <span
      className={className}
      role='button'
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onClick}
      filter-key={filterKey}
    >
      {children}
    </span>
  ) : (
    <span className={className}>{children}</span>
  );
}

QueryPill.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  filterKey: PropTypes.string,
  onClick: PropTypes.func,
};

/**
 * @param {Object} props
 * @param {[anchorField: string, anchorValue: string]} [props.anchorInfo]
 * @param {'AND' | 'OR'} [props.combineMode]
 * @param {import('../GuppyComponents/types').FilterState} props.filter
 * @param {import('../GuppyComponents/types').FilterConfig['info']} props.filterInfo
 * @param {ClickCombineModeHandler} [props.onClickCombineMode]
 * @param {ClickFilterHandler} [props.onClickFilter]
 */
function QueryDisplay({
  anchorInfo,
  combineMode,
  filter,
  filterInfo,
  onClickCombineMode,
  onClickFilter,
}) {
  const filterElements = /** @type {JSX.Element[]} */ ([]);
  const { __combineMode, ...__filter } = filter;
  const queryCombineMode = combineMode ?? __combineMode ?? 'AND';

  function handleClickCombineMode() {
    onClickCombineMode?.(queryCombineMode);
  }
  function handleClickFilter(/** @type {React.SyntheticEvent} */ e) {
    onClickFilter?.({
      field: e.currentTarget.attributes.getNamedItem('filter-key').value,
      anchorField: anchorInfo?.[0],
      anchorValue: anchorInfo?.[1],
    });
  }

  for (const [key, value] of Object.entries(__filter))
    if ('filter' in value) {
      const [anchorField, anchorValue] = key.split(':');
      filterElements.push(
        <QueryPill key={key} className='pill anchor'>
          <span className='token field'>
            With <code>{filterInfo[anchorField].label}</code> of{' '}
            <code>{`"${anchorValue}"`}</code>
          </span>
          <span className='token'>
            ({' '}
            <QueryDisplay
              anchorInfo={[anchorField, anchorValue]}
              filter={value.filter}
              filterInfo={filterInfo}
              combineMode={__combineMode}
              onClickCombineMode={onClickCombineMode}
              onClickFilter={onClickFilter}
            />{' '}
            )
          </span>
        </QueryPill>
      );
    } else if ('selectedValues' in value) {
      filterElements.push(
        <QueryPill key={key} onClick={handleClickFilter} filterKey={key}>
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
        </QueryPill>
      );
    } else {
      filterElements.push(
        <QueryPill key={key} onClick={handleClickFilter} filterKey={key}>
          <span className='token'>
            <code>{filterInfo[key].label}</code> is between
          </span>
          <span className='token'>
            <code>
              ({value.lowerBound}, {value.upperBound})
            </code>
          </span>
        </QueryPill>
      );
    }

  return (
    <span className='query-display'>
      {filterElements.map((filterElement, i) => (
        <Fragment key={i}>
          {filterElement}
          {i < filterElements.length - 1 && (
            <QueryPill onClick={handleClickCombineMode}>
              {queryCombineMode}
            </QueryPill>
          )}
        </Fragment>
      ))}
    </span>
  );
}

QueryDisplay.propTypes = {
  anchorInfo: PropTypes.arrayOf(PropTypes.string),
  combineMode: PropTypes.oneOf(['AND', 'OR']),
  filter: PropTypes.any.isRequired,
  filterInfo: PropTypes.objectOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
    })
  ),
  onClickCombineMode: PropTypes.func,
  onClickFilter: PropTypes.func,
};

export default QueryDisplay;
