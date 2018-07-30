import React from 'react';
import PropTypes from 'prop-types';
import { Aggregations } from '@arranger/components/dist/Arranger';
import AggregationWrapper from '../Arranger/AggregationWrapper';

class DataExplorerFilters extends React.Component {
  render() {
    const data = this.props.arrangerData;
    const filters = this.props.arrangerConfig.filters;
    const aggs = <Aggregations {...this.props} />;
    return (
      <div className="data-explorer__filters">
        <h4>Filters</h4>
        <AggregationWrapper filters={filters} {...this.props} />
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
