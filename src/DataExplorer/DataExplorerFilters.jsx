import React from 'react';
import PropTypes from 'prop-types';
import { Aggregations } from '@arranger/components/dist/Arranger';

class DataExplorerFilters extends React.Component {
  render() {
    return (
      <div className="data-explorer__filters">
        <h4>Filters</h4>
        <Aggregations {...this.props} />
      </div>
    );
  }
}

DataExplorerFilters.propTypes = {
  arrangerData: PropTypes.object,
};

DataExplorerFilters.defaultProps = {
  arrangerData: {},
};

export default DataExplorerFilters;
