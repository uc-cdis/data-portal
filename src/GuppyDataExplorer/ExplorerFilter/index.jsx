import React from 'react';
import PropTypes from 'prop-types';
import ConnectedFilter from '@gen3/guppy/dist/components/ConnectedFilter';
import AccessibleFilter from '@gen3/guppy/dist/components/ConnectedFilter/AccessibleFilter';
import UnaccessibleFilter from '@gen3/guppy/dist/components/ConnectedFilter/UnaccessibleFilter';
import TierAccessSelector from '../TierAccessSelector';
import {
  FilterConfigType,
  GuppyConfigType,
} from '../configTypeDef';
import { checkForNoAccessibleProject, checkForFullAccessibleProject } from '../GuppyDataExplorerHelper';
import { labelToPlural } from '../utils';
import { explorerHideEmptyFilterSection, explorerFilterValuesToHide } from '../../localconf';

/**
 * For selectedAccessFilter the default value is 'Data with Access'
 * if TIER_ACCESS_LEVEL is 'regular'
 * Otherwise 'All Data' is selected
 */
class ExplorerFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAccessFilter: (this.props.tierAccessLevel === 'regular') ? 'with-access' : 'all-data', // default value of selectedAccessFilter
      showTierAccessSelector: false,
    };
  }

  getSnapshotBeforeUpdate(prevProps) {
    if (prevProps.accessibleFieldObject !== this.props.accessibleFieldObject
      || prevProps.unaccessibleFieldObject !== this.props.unaccessibleFieldObject
    ) {
      if (this.props.tierAccessLevel === 'libre') {
        this.setState({ selectedAccessFilter: 'all-data' });
        return null;
      }
      if (this.props.tierAccessLevel === 'regular') {
        if (checkForNoAccessibleProject(
          this.props.accessibleFieldObject,
          this.props.guppyConfig.accessibleValidationField,
        ) || checkForFullAccessibleProject(
          this.props.unaccessibleFieldObject,
          this.props.guppyConfig.accessibleValidationField,
        )) {
          // don't show this selector if user have full access, or none access
          this.setState({ showTierAccessSelector: false });
          // if user don't have access to any projects
          // apply 'all-data' filter so agg data is available
          if (checkForNoAccessibleProject(
            this.props.accessibleFieldObject,
            this.props.guppyConfig.accessibleValidationField,
          )) {
            this.setState({ selectedAccessFilter: 'all-data' });
          }
        } else {
          this.setState({ showTierAccessSelector: true });
        }
      }
    }
    return null;
  }

  componentDidUpdate() {
  }

  /**
   * For "regular" tier access level commons, we use this function parse
   * aggsData and returned parsed aggregation for Guppy's ConnectedFilter.
   * We do following steps for tier access fields/values (currently, field="project")
   * 1. According to selected access filter (with, without, or all data access),
   *    we hide accessible or unaccessible items
   * 2. We add "accessible" property to items so that filter component will show lock icon
   */
  onProcessFilterAggsData = (aggsData) => {
    if (this.props.tierAccessLevel !== 'regular') {
      return aggsData;
    }
    if (aggsData === null) {
      return aggsData;
    }
    const newAggsData = Object.keys(aggsData).reduce((res, field) => {
      // if the field is not in accessibleFieldObject, no need to process it
      if (!Object.keys(this.props.accessibleFieldObject).includes(field)) {
        res[field] = aggsData[field];
        return res;
      }
      // if the field is in accessibleFieldObject, add "accessible=false"
      // to those items which are unaccessible
      const accessibleValues = this.props.accessibleFieldObject[field];
      const newHistogram = aggsData[field].histogram
        .filter(({ key }) => {
          const accessible = accessibleValues.includes(key);
          switch (this.state.selectedAccessFilter) {
          case 'all-data':
            return true; // always show all items if 'all-data'
          case 'with-access':
            return accessible; // only show accessible items if 'with-access'
          case 'without-access':
            return !accessible; // only show unaccessible items if 'without-access'
          default:
            throw new Error('Invalid access filter option');
          }
        })
        .map(({ key, count }) => ({
          key,
          count,
          accessible: accessibleValues.includes(key),
        }));
      res[field] = { histogram: newHistogram };
      return res;
    }, {});
    return newAggsData;
  };

  handleAccessSelectorChange = (selectedAccessFilter) => {
    // selectedAccessFilter will be one of: 'with-access', 'without-access', or 'all-data'
    this.setState({ selectedAccessFilter });
  };

  render() {
    const filterProps = {
      filterConfig: this.props.filterConfig,
      extraAggsFields: this.props.extraAggsFields,
      guppyConfig: { type: this.props.guppyConfig.dataType, ...this.props.guppyConfig },
      fieldMapping: this.props.guppyConfig.fieldMapping,
      onFilterChange: this.props.onFilterChange,
      onReceiveNewAggsData: this.props.onReceiveNewAggsData,
      tierAccessLimit: this.props.tierAccessLevel === 'regular' ? this.props.tierAccessLimit : undefined,
      onProcessFilterAggsData: this.onProcessFilterAggsData,
      onUpdateAccessLevel: this.props.onUpdateAccessLevel,
      adminAppliedPreFilters: this.props.adminAppliedPreFilters,
      userFilterFromURL: this.props.userFilterFromURL,
      lockedTooltipMessage: this.props.tierAccessLevel === 'regular' ? `You may only view summary information for this project. You do not have ${this.props.guppyConfig.dataType}-level access.` : '',
      disabledTooltipMessage: this.props.tierAccessLevel === 'regular' ? `This resource is currently disabled because you are exploring restricted data. When exploring restricted data you are limited to exploring cohorts of ${this.props.tierAccessLimit} ${
        this.props.guppyConfig.nodeCountTitle
          ? this.props.guppyConfig.nodeCountTitle.toLowerCase()
          : labelToPlural(this.props.guppyConfig.dataType)
      } or more.` : '',
      accessibleFieldCheckList: this.props.accessibleFieldCheckList,
      hideEmptyFilterSection: explorerHideEmptyFilterSection,
      filterValuesToHide: explorerFilterValuesToHide,
    };
    let filterFragment;
    switch (this.state.selectedAccessFilter) {
    case 'all-data':
      filterFragment = (
        <React.Fragment>
          <h4>Filters</h4>
          <ConnectedFilter {...filterProps} />
        </React.Fragment>
      );
      break;
    case 'with-access':
      filterFragment = (
        <React.Fragment>
          <h4>Filters</h4>
          <AccessibleFilter {...filterProps} />
        </React.Fragment>
      );
      break;
    case 'without-access':
      filterFragment = (
        <React.Fragment>
          <h4>Filters</h4>
          <UnaccessibleFilter {...filterProps} />
        </React.Fragment>
      );
      break;
    default:
      filterFragment = (<React.Fragment />);
      break;
    }
    return (
      <div className={this.props.className}>
        {
          this.state.showTierAccessSelector ? (
            <TierAccessSelector
              onSelectorChange={this.handleAccessSelectorChange}
              getAccessButtonLink={this.props.getAccessButtonLink}
              hideGetAccessButton={this.props.hideGetAccessButton}
            />
          ) : (<React.Fragment />)
        }
        {filterFragment}
      </div>
    );
  }
}

ExplorerFilter.propTypes = {
  className: PropTypes.string,
  tierAccessLevel: PropTypes.string.isRequired,
  extraAggsFields: PropTypes.arrayOf(PropTypes.string),
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
  accessibleFieldCheckList: PropTypes.arrayOf(PropTypes.string), // inherit from GuppyWrapper
  getAccessButtonLink: PropTypes.string,
  hideGetAccessButton: PropTypes.bool,
  userFilterFromURL: PropTypes.object,
};

ExplorerFilter.defaultProps = {
  className: '',
  extraAggsFields: [],
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
  accessibleFieldCheckList: [],
  getAccessButtonLink: undefined,
  hideGetAccessButton: false,
  userFilterFromURL: {},
};

export default ExplorerFilter;
