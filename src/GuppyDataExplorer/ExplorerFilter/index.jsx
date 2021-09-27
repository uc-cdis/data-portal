import React from 'react';
import PropTypes from 'prop-types';
import ConnectedFilter from '../../GuppyComponents/ConnectedFilter';
import { FilterConfigType, GuppyConfigType } from '../configTypeDef';
import './ExplorerFilter.css';

/**
 * @typedef {Object} ExplorerFilterProps
 * @property {{ [x: string]: OptionFilter }} [adminAppliedPreFilters]
 * @property {string} [className]
 * @property {FilterConfig} filterConfig
 * @property {GuppyConfig} guppyConfig
 * @property {boolean} [hasAppliedFilters]
 * @property {FilterState} [initialAppliedFilters]
 * @property {SimpleAggsData} [initialTabsOptions]
 * @property {FilterState} filter
 * @property {FilterChangeHandler} onFilterChange
 * @property {() => void} [onFilterClear]
 * @property {(anchorValue: string) => void} onAnchorValueChange
 * @property {(x: string[]) => void} [onPatientIdsChange]
 * @property {string[]} [patientIds]
 * @property {SimpleAggsData} tabsOptions
 * @property {number} [tierAccessLimit]
 */

/** @param {ExplorerFilterProps} props */
function ExplorerFilter({
  className = '',
  hasAppliedFilters,
  onFilterClear,
  ...filterProps
}) {
  return (
    <div className={className}>
      <div className='guppy-explorer-filter__title-container'>
        <h4 className='guppy-explorer-filter__title'>Filters</h4>
        {hasAppliedFilters && (
          <button
            type='button'
            className='guppy-explorer-filter__clear-button'
            onClick={onFilterClear}
          >
            Clear all
          </button>
        )}
      </div>
      <ConnectedFilter {...filterProps} />
    </div>
  );
}

ExplorerFilter.propTypes = {
  adminAppliedPreFilters: PropTypes.object,
  className: PropTypes.string,
  filterConfig: FilterConfigType.isRequired,
  guppyConfig: GuppyConfigType.isRequired,
  hasAppliedFilters: PropTypes.bool,
  initialAppliedFilters: PropTypes.object,
  onFilterClear: PropTypes.func,
  onPatientIdsChange: PropTypes.func,
  patientIds: PropTypes.arrayOf(PropTypes.string),
  tierAccessLimit: PropTypes.number,
  filter: PropTypes.object.isRequired, // from GuppyWrapper
  initialTabsOptions: PropTypes.object, // from GuppyWrapper
  onAnchorValueChange: PropTypes.func.isRequired, // from GuppyWrapper
  onFilterChange: PropTypes.func.isRequired, // from GuppyWrapper
  tabsOptions: PropTypes.object.isRequired, // from GuppWrapper
};

export default ExplorerFilter;
