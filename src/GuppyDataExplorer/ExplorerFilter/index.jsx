import React from 'react';
import PropTypes from 'prop-types';
import ConnectedFilter from '@gen3/guppy/dist/components/ConnectedFilter';
import TierAccessSelector from '../TierAccessSelector';
import {
  FilterConfigType,
} from '../configTypeDef';

class ExplorerFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAccessFilter: 'all-data', // default value of selectedAccessFilter
    };
  }

  // should check/modify aggsData accordingly in here
  // for each element in aggsData.field.histogram, besides of key and count we also want a bool val `accessible`
  // accessible=false will display lock icon in filter
  // in this func, for each element in aggsData, we need to check if its field exists in this.props.accessibleFieldObject
  // and if yes, for each element in aggsData.field.histogram, add accessible prop accordingly
  // and finally, remove unwanted elements in aggsData according to this.state.selectedAccessFilter
  // for now for aggsData.field and this.props.accessibleFieldObject.field, we only cares about field = `project`
  onProcessFilterAggsData = (aggsData) => {
    if (this.props.tierAccessLevel !== 'regular') {
      return aggsData;
    }
    if (this.props.accessibleFieldObject) {
      switch (this.state.selectedAccessFilter) {
      case 'with-access':
        for (key in Object.keys(this.props.accessibleFieldObject)) {
          if (aggsData[key]) { // field also found in aggsData
            let aggsDataValuesArray = aggsData.key.histogram;
            for (let i = 0; i < aggsDataArray.length; i += 1) {
              if (!this.props.accessibleFieldObject.key.includes(aggsDataArray[i])) {
                aggsData[key].splice(i, 1);
              } else {
                aggsData[key]
              }
            }
          }
        }
      case 'without-access':
      case 'all-data':
      default:
        throw new Error('Unexpected case in accessibleFieldObject switch');
      }
    }
  }

  handleAccessSelectorChange = (selectedAccessFilter) => {
    // selectedAccessFilter will be one of: 'with-access', 'without-access', or 'all-data'
    this.setState(selectedAccessFilter);
    console.log(selectedAccessFilter);
  }

  render() {
    return (
      <div className={this.props.className}>
        {
          this.props.tierAccessLevel === 'regular' ? (
            <TierAccessSelector onSelectorChange={this.handleAccessSelectorChange} />
          ) : (<React.Fragment />)
        }
        <ConnectedFilter
          filterConfig={this.props.filterConfig}
          guppyConfig={{ type: this.props.guppyConfig.dataType, ...this.props.guppyConfig }}
          fieldMapping={this.props.guppyConfig.fieldMapping}
          onFilterChange={this.props.onFilterChange}
          onReceiveNewAggsData={this.props.onReceiveNewAggsData}
          tierAccessLimit={this.props.tierAccessLevel === 'regular' ? this.props.tierAccessLimit : undefined}
          onProcessFilterAggsData={this.onProcessFilterAggsData}
        />
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
  accessibleFieldObject: {
    project: ['DEV-test', 'jnkns-jenkins'],
  },
};

export default ExplorerFilter;
