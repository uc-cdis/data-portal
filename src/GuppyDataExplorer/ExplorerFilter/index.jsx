import React from 'react';
import PropTypes from 'prop-types';
import ConnectedFilter from '../../GuppyComponents/ConnectedFilter';
import { FilterConfigType, GuppyConfigType } from '../configTypeDef';

function ExplorerFilter({
  className = '',
  filterConfig = {},
  guppyConfig = {},
  onFilterChange = () => {},
  onPatientIdsChange = () => {},
  tierAccessLimit,
  adminAppliedPreFilters = {},
  initialAppliedFilters = {},
  patientIds,
  receivedAggsData = {},
}) {
  const filterProps = {
    filterConfig,
    guppyConfig,
    onFilterChange,
    onPatientIdsChange,
    tierAccessLimit,
    adminAppliedPreFilters,
    patientIds,
    initialAppliedFilters,
    receivedAggsData,
  };
  return (
    <div className={className}>
      <h4>Filters</h4>
      <ConnectedFilter {...filterProps} />
    </div>
  );
}

ExplorerFilter.propTypes = {
  className: PropTypes.string,
  filterConfig: FilterConfigType, // inherit from GuppyWrapper
  guppyConfig: GuppyConfigType, // inherit from GuppyWrapper
  onFilterChange: PropTypes.func, // inherit from GuppyWrapper
  onReceiveNewAggsData: PropTypes.func, // inherit from GuppyWrapper
  tierAccessLimit: PropTypes.number, // inherit from GuppyWrapper
  adminAppliedPreFilters: PropTypes.object, // inherit from GuppyWrapper
  patientIds: PropTypes.arrayOf(PropTypes.string), // inherit from GuppyWrapper
  initialAppliedFilters: PropTypes.object,
  onPatientIdsChange: PropTypes.func,
};

export default ExplorerFilter;
