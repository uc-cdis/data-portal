import { Fragment } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';
import { FILTER_TYPE } from '../GuppyComponents/Utils/const';
import './FilterDisplay.css';

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
 * @param {React.EventHandler<any>} [props.onClose]
 */
function Pill({ className = 'pill', children, filterKey, onClick, onClose }) {
  return (
    <div className='pill-container'>
      {typeof onClick === 'function' ? (
        <button
          className={className}
          type='button'
          onClick={onClick}
          filter-key={filterKey}
        >
          {children}
        </button>
      ) : (
        <span className={className}>{children}</span>
      )}
      {typeof onClose === 'function' ? (
        <button
          className='pill close'
          type='button'
          onClick={onClose}
          filter-key={filterKey}
        >
          <i className='g3-icon g3-icon--cross g3-icon--sm' />
        </button>
      ) : null}
    </div>
  );
}

Pill.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  filterKey: PropTypes.string,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
};

/** @typedef {import('../GuppyComponents/types').FilterConfig} FilterConfig */

/** @typedef {import('../GuppyDataExplorer/types').ExplorerFilterSet} ExplorerFilterSet */

/**
 * @param {Object} props
 * @param {[anchorField: string, anchorValue: string]} [props.anchorInfo]
 * @param {'AND' | 'OR'} [props.combineMode]
 * @param {ExplorerFilterSet['filter']} props.filter
 * @param {FilterConfig['info']} props.filterInfo
 * @param {ClickCombineModeHandler} [props.onClickCombineMode]
 * @param {ClickFilterHandler} [props.onClickFilter]
 * @param {ClickFilterHandler} [props.onCloseFilter]
 */
function FilterDisplay({
  anchorInfo,
  combineMode,
  filter,
  filterInfo,
  onClickCombineMode,
  onClickFilter,
  onCloseFilter,
}) {
  if (filter.__type === FILTER_TYPE.COMPOSED)
    return (
      <span className='filter-display'>
        {filter.value.map((__filter, i) => (
          <Fragment key={i}>
            {__filter.__type === 'REF' ? (
              <Pill>{__filter.value.label}</Pill>
            ) : (
              <span className='pill-container'>
                <FilterDisplay filter={__filter} filterInfo={filterInfo} />
              </span>
            )}
            {i < filter.value.length - 1 && <Pill>{filter.__combineMode}</Pill>}
          </Fragment>
        ))}
      </span>
    );

  const filterElements = /** @type {JSX.Element[]} */ ([]);
  const { __combineMode, value: __filter } = filter;
  const filterCombineMode = combineMode ?? __combineMode ?? 'AND';

  const handleClickCombineMode =
    typeof onClickCombineMode === 'function'
      ? () => onClickCombineMode(filterCombineMode)
      : undefined;
  const handleClickFilter =
    typeof onClickFilter === 'function'
      ? (/** @type {React.SyntheticEvent} */ e) => {
          onClickFilter({
            field: e.currentTarget.attributes.getNamedItem('filter-key').value,
            anchorField: anchorInfo?.[0],
            anchorValue: anchorInfo?.[1],
          });
        }
      : undefined;
  const handleCloseFilter =
    typeof onCloseFilter === 'function'
      ? (/** @type {React.SyntheticEvent} */ e) => {
          onCloseFilter({
            field: e.currentTarget.attributes.getNamedItem('filter-key').value,
            anchorField: anchorInfo?.[0],
            anchorValue: anchorInfo?.[1],
          });
        }
      : undefined;

  for (const [key, value] of Object.entries(__filter))
    if (value.__type === FILTER_TYPE.ANCHORED) {
      const [anchorField, anchorValue] = key.split(':');
      filterElements.push(
        <Pill key={key}>
          <span className='token field'>
            With <code>{filterInfo[anchorField].label}</code> of{' '}
            <code>{`"${anchorValue}"`}</code>
          </span>
          <span className='token'>
            ({' '}
            <FilterDisplay
              anchorInfo={[anchorField, anchorValue]}
              // @ts-ignore Innocuous error due to using AnchorFilterState
              filter={value}
              filterInfo={filterInfo}
              combineMode={__combineMode}
              onClickCombineMode={onClickCombineMode}
              onClickFilter={onClickFilter}
              onCloseFilter={onCloseFilter}
            />{' '}
            )
          </span>
        </Pill>
      );
    } else if (value.__type === FILTER_TYPE.OPTION) {
      filterElements.push(
        <Pill
          key={key}
          onClick={handleClickFilter}
          onClose={handleCloseFilter}
          filterKey={key}
        >
          <span className='token'>
            <code>{filterInfo[key].label}</code>{' '}
            {value.selectedValues.length > 1
              ? `is ${value.isExclusion ? 'not' : ''} any of `
              : `is ${value.isExclusion ? 'not' : ''} `}
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
        </Pill>
      );
    } else if (value.__type === FILTER_TYPE.RANGE) {
      filterElements.push(
        <Pill
          key={key}
          onClick={handleClickFilter}
          onClose={handleCloseFilter}
          filterKey={key}
        >
          <span className='token'>
            <code>{filterInfo[key].label}</code>
            {' is between '}
          </span>
          <span className='token'>
            <code>
              ({value.lowerBound}, {value.upperBound})
            </code>
          </span>
        </Pill>
      );
    }

  return (
    <span className='filter-display'>
      {filterElements.map((filterElement, i) => (
        <Fragment key={i}>
          {filterElement}
          {i < filterElements.length - 1 && (
            <Pill onClick={handleClickCombineMode}>{filterCombineMode}</Pill>
          )}
        </Fragment>
      ))}
    </span>
  );
}

FilterDisplay.propTypes = {
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
  onCloseFilter: PropTypes.func,
};

export default FilterDisplay;
