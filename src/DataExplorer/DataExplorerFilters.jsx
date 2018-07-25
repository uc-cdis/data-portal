import React from 'react';
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

export default DataExplorerFilters;
