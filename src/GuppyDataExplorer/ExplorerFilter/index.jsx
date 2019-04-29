import React from 'react';
import PropTypes from 'prop-types';
import ConnectedFilter from '@gen3/guppy/dist/components/ConnectedFilter';
import TierAccessSelector from '../TierAccessSelector';
import {
  FilterConfigType,
} from '../configTypeDef';

class ExplorerFilter extends React.Component {
  handleAccessSelectorChange = (selectedAccessFilter) => {
    // selectedAccessFilter will be one of: 'with-access', 'without-access', or 'all-data'
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
};

ExplorerFilter.defaultProps = {
  className: '',
  filterConfig: {},
  guppyConfig: {},
  fieldMapping: {},
  onFilterChange: () => {},
  onReceiveNewAggsData: () => {},
};

export default ExplorerFilter;
