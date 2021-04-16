import React from 'react';
import PropTypes from 'prop-types';
import ConnectedFilter from '@pcdc/guppy/dist/components/ConnectedFilter';
import TierAccessSelector from '../TierAccessSelector';
import { FilterConfigType, GuppyConfigType } from '../configTypeDef';
import FilterGroup from '../../gen3-ui-component/components/filters/FilterGroup';
import FilterList from '../../gen3-ui-component/components/filters/FilterList';

/**
 * For selectedAccessFilter the default value is 'Data with Access'
 * if TIER_ACCESS_LEVEL is 'regular'
 * Otherwise 'All Data' is selected
 */
class ExplorerFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAccessFilter:
        this.props.tierAccessLevel === 'regular' ? 'with-access' : 'all-data', // default value of selectedAccessFilter
      showTierAccessSelector: false,
    };
  }

  handleAccessSelectorChange = (selectedAccessFilter) => {
    // selectedAccessFilter will be one of: 'with-access', 'without-access', or 'all-data'
    this.setState({ selectedAccessFilter });
  };

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
      tierAccessLimit:
        this.props.tierAccessLevel === 'regular'
          ? this.props.tierAccessLimit
          : undefined,
      onUpdateAccessLevel: this.props.onUpdateAccessLevel,
      adminAppliedPreFilters: this.props.adminAppliedPreFilters,
      initialAppliedFilters: this.props.initialAppliedFilters,
      lockedTooltipMessage:
        this.props.tierAccessLevel === 'regular'
          ? `You may only view summary information for this project. You do not have ${this.props.guppyConfig.dataType}-level access.`
          : '',
      disabledTooltipMessage:
        this.props.tierAccessLevel === 'regular'
          ? `This resource is currently disabled because you are exploring restricted data. When exploring restricted data you are limited to exploring cohorts of ${
              this.props.tierAccessLimit
            } ${
              this.props.guppyConfig.nodeCountTitle.toLowerCase() ||
              this.props.guppyConfig.dataType
            } or more.`
          : '',
      accessibleFieldCheckList: this.props.accessibleFieldCheckList,
      filterComponents: {
        FilterGroup,
        FilterList,
      },
    };
    return (
      <div className={this.props.className}>
        {this.state.showTierAccessSelector ? (
          <TierAccessSelector
            onSelectorChange={this.handleAccessSelectorChange}
            getAccessButtonLink={this.props.getAccessButtonLink}
            hideGetAccessButton={this.props.hideGetAccessButton}
          />
        ) : (
          <React.Fragment />
        )}
        <h4>Filters</h4>
        <ConnectedFilter {...filterProps} />
      </div>
    );
  }
}

ExplorerFilter.propTypes = {
  className: PropTypes.string,
  tierAccessLevel: PropTypes.string.isRequired,
  filterConfig: FilterConfigType, // inherit from GuppyWrapper
  guppyConfig: GuppyConfigType, // inherit from GuppyWrapper
  fieldMapping: PropTypes.array, // inherit from GuppyWrapper
  onFilterChange: PropTypes.func, // inherit from GuppyWrapper
  onUpdateAccessLevel: PropTypes.func, // inherit from GuppyWrapper
  onReceiveNewAggsData: PropTypes.func, // inherit from GuppyWrapper
  tierAccessLimit: PropTypes.number, // inherit from GuppyWrapper
  accessibleFieldObject: PropTypes.object, // inherit from GuppyWrapper
  unaccessibleFieldObject: PropTypes.object, // inherit from GuppyWrapper
  adminAppliedPreFilters: PropTypes.object, // inherit from GuppyWrapper
  initialAppliedFilters: PropTypes.object,
  accessibleFieldCheckList: PropTypes.arrayOf(PropTypes.string), // inherit from GuppyWrapper
  getAccessButtonLink: PropTypes.string,
  hideGetAccessButton: PropTypes.bool,
};

ExplorerFilter.defaultProps = {
  className: '',
  filterConfig: {},
  guppyConfig: {},
  fieldMapping: [],
  onFilterChange: () => {},
  onUpdateAccessLevel: () => {},
  onReceiveNewAggsData: () => {},
  tierAccessLimit: undefined,
  accessibleFieldObject: {},
  unaccessibleFieldObject: {},
  adminAppliedPreFilters: {},
  initialAppliedFilters: {},
  accessibleFieldCheckList: [],
  getAccessButtonLink: undefined,
  hideGetAccessButton: false,
};

export default ExplorerFilter;
