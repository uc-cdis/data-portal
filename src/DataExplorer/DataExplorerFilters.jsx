import React from 'react';
import PropTypes from 'prop-types';
import AggregationTabs from '../Arranger/AggregationTabs';

class DataExplorerFilters extends React.Component {
  render() {
    return (
      <div className="data-explorer__filters">
        <h4 className="data-explorer__filters-title">Filters</h4>
        <AggregationTabs
          filterConfig={this.props.arrangerConfig.filters}
          {...this.props}
        />
      </div>
    );
  }
}

DataExplorerFilters.propTypes = {
  arrangerData: PropTypes.object,
  arrangerConfig: PropTypes.object,
};

DataExplorerFilters.defaultProps = {
  arrangerData: null,
  arrangerConfig: {},
};

export default DataExplorerFilters;
