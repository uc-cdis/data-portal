import React from 'react';
import PropTypes from 'prop-types';
import ConnectedFilter from '@pcdc/guppy/dist/components/ConnectedFilter';
import { FilterConfigType, GuppyConfigType } from '../configTypeDef';
import FilterGroup from '../../gen3-ui-component/components/filters/FilterGroup';
import FilterList from '../../gen3-ui-component/components/filters/FilterList';

/**
 * For selectedAccessFilter the default value is 'Data with Access'
 * if TIER_ACCESS_LEVEL is 'regular'
 * Otherwise 'All Data' is selected
 */
class ExplorerFilter extends React.Component {
  render() {
    const filterProps = {
      filterConfig: this.props.filterConfig,
      guppyConfig: {
        type: this.props.guppyConfig.dataType,
        ...this.props.guppyConfig,
      },
      fieldMapping: this.props.guppyConfig.fieldMapping,
      onFilterChange: this.props.onFilterChange,
      onReceiveNewAggsData: this.props.onReceiveNewAggsData,
      tierAccessLimit: this.props.tierAccessLimit,
      adminAppliedPreFilters: this.props.adminAppliedPreFilters,
      initialAppliedFilters: this.props.initialAppliedFilters,
      lockedTooltipMessage: `You may only view summary information for this project. You do not have ${this.props.guppyConfig.dataType}-level access.`,
      disabledTooltipMessage: `This resource is currently disabled because you are exploring restricted data. When exploring restricted data you are limited to exploring cohorts of ${
        this.props.tierAccessLimit
      } ${
        this.props.guppyConfig.nodeCountTitle.toLowerCase() ||
        this.props.guppyConfig.dataType
      } or more.`,
      filterComponents: {
        FilterGroup,
        FilterList,
      },
    };
    return (
      <div className={this.props.className}>
        <h4>Filters</h4>
        <ConnectedFilter {...filterProps} />
      </div>
    );
  }
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

ExplorerFilter.defaultProps = {
  className: '',
  filterConfig: {},
  guppyConfig: {},
  onFilterChange: () => {},
  onReceiveNewAggsData: () => {},
  tierAccessLimit: undefined,
  adminAppliedPreFilters: {},
  initialAppliedFilters: {},
};

export default ExplorerFilter;
