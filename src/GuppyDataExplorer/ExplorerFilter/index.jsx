import React from 'react';
import PropTypes from 'prop-types';
import ConnectedFilter from '@gen3/guppy/dist/components/ConnectedFilter';
import AccessibleFilter from '@gen3/guppy/dist/components/ConnectedFilter/AccessibleFilter';
import UnaccessibleFilter from '@gen3/guppy/dist/components/ConnectedFilter/UnaccessibleFilter';
import TierAccessSelector from '../TierAccessSelector';
import {
  FilterConfigType,
} from '../configTypeDef';
import { checkForNoAccessibleProject } from '../GuppyDataExplorerHelper';

class ExplorerFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAccessFilter: 'all-data', // default value of selectedAccessFilter
    };
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
      guppyConfig: { type: this.props.guppyConfig.dataType, ...this.props.guppyConfig },
      fieldMapping: this.props.guppyConfig.fieldMapping,
      onFilterChange: this.props.onFilterChange,
      onReceiveNewAggsData: this.props.onReceiveNewAggsData,
      tierAccessLimit: this.props.tierAccessLevel === 'regular' ? this.props.tierAccessLimit : undefined,
      onProcessFilterAggsData: this.onProcessFilterAggsData,
    };
    let filterFragment;
    switch (this.state.selectedAccessFilter) {
    case 'all-data':
      filterFragment = (<ConnectedFilter {...filterProps} />);
      break;
    case 'with-access':
      filterFragment = (<AccessibleFilter {...filterProps} />);
      break;
    case 'without-access':
      filterFragment = (<UnaccessibleFilter {...filterProps} />);
      break;
    default:
      break;
    }
    return (
      <div className={this.props.className}>
        {
          (this.props.tierAccessLevel === 'regular' && !checkForNoAccessibleProject(this.props.accessibleFieldObject)) ? (
            <TierAccessSelector onSelectorChange={this.handleAccessSelectorChange} />
          ) : (<React.Fragment />)
        }
        <h4><span className='connected-filter__title'>Filters</span></h4>
        {filterFragment}
      </div>
    );
  }
}

ExplorerFilter.propTypes = {
  className: PropTypes.string,
  tierAccessLevel: PropTypes.string.isRequired,
  filterConfig: FilterConfigType, // inherit from GuppyWrapper
  guppyConfig: PropTypes.object, // inherit from GuppyWrapper
  fieldMapping: PropTypes.array, // inherit from GuppyWrapper
  onFilterChange: PropTypes.func, // inherit from GuppyWrapper
  onReceiveNewAggsData: PropTypes.func, // inherit from GuppyWrapper
  tierAccessLimit: PropTypes.number, // inherit from GuppyWrapper
  accessibleFieldObject: PropTypes.object, // inherit from GuppyWrapper
};

ExplorerFilter.defaultProps = {
  className: '',
  filterConfig: {},
  guppyConfig: {},
  fieldMapping: [],
  onFilterChange: () => {},
  onReceiveNewAggsData: () => {},
  tierAccessLimit: undefined,
  accessibleFieldObject: {},
};

export default ExplorerFilter;
