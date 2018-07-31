import React from 'react';
import PropTypes from 'prop-types';
import { Aggregations } from '@arranger/components/dist/Arranger';
import AggregationTabs from '../Arranger/AggregationTabs';

class DataExplorerFilters extends React.Component {
  render() {
    const data = this.props.arrangerData;
    const filterConfig = this.props.arrangerConfig.filters;
    const aggs = <Aggregations {...this.props} />;
    return (
      <div className="data-explorer__filters">
        <h4 className="data-explorer__filters-title">Filters</h4>
        <AggregationTabs filterConfig={filterConfig} {...this.props} />
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
