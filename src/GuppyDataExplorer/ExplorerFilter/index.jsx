import React from 'react';
import PropTypes from 'prop-types';
import ConnectedFilter from '../../GuppyComponents/ConnectedFilter';
import { FilterConfigType, GuppyConfigType } from '../configTypeDef';
import FilterGroup from '../../gen3-ui-component/components/filters/FilterGroup';
import FilterList from '../../gen3-ui-component/components/filters/FilterList';

function ExplorerFilter({
  className = '',
  filterConfig = {},
  guppyConfig = {},
  onFilterChange = () => {},
  tierAccessLimit,
  adminAppliedPreFilters = {},
  initialAppliedFilters = {},
  receivedAggsData = {},
}) {
  const filterProps = {
    filterConfig,
    guppyConfig: {
      type: guppyConfig.dataType,
      ...guppyConfig,
    },
    fieldMapping: guppyConfig.fieldMapping,
    onFilterChange,
    tierAccessLimit,
    adminAppliedPreFilters,
    initialAppliedFilters,
    receivedAggsData,
    lockedTooltipMessage: `You may only view summary information for this project. You do not have ${guppyConfig.dataType}-level access.`,
    disabledTooltipMessage: `This resource is currently disabled because you are exploring restricted data. When exploring restricted data you are limited to exploring cohorts of ${tierAccessLimit} ${
      guppyConfig.nodeCountTitle.toLowerCase() || guppyConfig.dataType
    } or more.`,
    filterComponents: {
      FilterGroup,
      FilterList,
    },
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
  initialAppliedFilters: PropTypes.object,
};

export default ExplorerFilter;
