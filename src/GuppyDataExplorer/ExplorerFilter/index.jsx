import React from 'react';
import PropTypes from 'prop-types';
import ConnectedFilter from '../../GuppyComponents/ConnectedFilter';
import { useExplorerConfig } from '../ExplorerConfigContext';
import { useExplorerState } from '../ExplorerStateContext';
import './ExplorerFilter.css';

/**
 * @typedef {Object} ExplorerFilterProps
 * @property {string} [className]
 * @property {FilterState} [initialAppliedFilters]
 * @property {SimpleAggsData} [initialTabsOptions]
 * @property {FilterState} filter
 * @property {FilterChangeHandler} onFilterChange
 * @property {() => void} [onFilterClear]
 * @property {(anchorValue: string) => void} onAnchorValueChange
 * @property {(x: string[]) => void} [onPatientIdsChange]
 * @property {string[]} [patientIds]
 * @property {SimpleAggsData} tabsOptions
 */

/** @param {ExplorerFilterProps} props */
function ExplorerFilter({ className = '', onFilterClear, ...filterProps }) {
  const {
    adminAppliedPreFilters,
    filterConfig,
    guppyConfig,
    tierAccessLimit,
  } = useExplorerConfig().current;
  const {
    initialAppliedFilters,
    patientIds,
    clearFilters,
    handlePatientIdsChange,
  } = useExplorerState();
  const connectedFilterProps = {
    ...filterProps,
    adminAppliedPreFilters,
    filterConfig,
    guppyConfig,
    initialAppliedFilters,
    patientIds,
    tierAccessLimit,
    onPatientIdsChange: handlePatientIdsChange,
  };
  const hasAppliedFilters = Object.keys(filterProps.filter).length > 0;

  return (
    <div className={className}>
      <div className='explorer-filter__title-container'>
        <h4 className='explorer-filter__title'>Filters</h4>
        {hasAppliedFilters && (
          <button
            type='button'
            className='explorer-filter__clear-button'
            onClick={clearFilters}
          >
            Clear all
          </button>
        )}
      </div>
      <ConnectedFilter {...connectedFilterProps} />
    </div>
  );
}

ExplorerFilter.propTypes = {
  className: PropTypes.string,
  initialAppliedFilters: PropTypes.object,
  onFilterClear: PropTypes.func,
  onPatientIdsChange: PropTypes.func,
  patientIds: PropTypes.arrayOf(PropTypes.string),
  filter: PropTypes.object.isRequired, // from GuppyWrapper
  initialTabsOptions: PropTypes.object, // from GuppyWrapper
  onAnchorValueChange: PropTypes.func.isRequired, // from GuppyWrapper
  onFilterChange: PropTypes.func.isRequired, // from GuppyWrapper
  tabsOptions: PropTypes.object.isRequired, // from GuppWrapper
};

export default ExplorerFilter;
