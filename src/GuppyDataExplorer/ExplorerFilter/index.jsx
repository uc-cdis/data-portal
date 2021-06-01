import React from 'react';
import PropTypes from 'prop-types';
import ConnectedFilter from '../../GuppyComponents/ConnectedFilter';
import { FilterConfigType, GuppyConfigType } from '../configTypeDef';

function ExplorerFilter({ className = '', ...filterProps }) {
  return (
    <div className={className}>
      <h4>Filters</h4>
      <ConnectedFilter {...filterProps} />
    </div>
  );
}

ExplorerFilter.propTypes = {
  className: PropTypes.string,
  filterConfig: FilterConfigType.isRequired,
  guppyConfig: GuppyConfigType.isRequired,
  tierAccessLimit: PropTypes.number,
  adminAppliedPreFilters: PropTypes.object,
  initialAppliedFilters: PropTypes.object,
  patientIds: PropTypes.arrayOf(PropTypes.string),
  onPatientIdsChange: PropTypes.func,
  onFilterChange: PropTypes.func, // inherit from GuppyWrapper
  onReceiveNewAggsData: PropTypes.func, // inherit from GuppyWrapper
};

export default ExplorerFilter;
