import React from 'react';
import PropTypes from 'prop-types';
import { Aggregations } from '@arranger/components/dist/Arranger';
import AggregationTabs from '../Arranger/AggregationTabs';

class DataExplorerFilters extends React.Component {
  render() {
    const filterConfig = this.props.arrangerConfig.filters;
    return (
      <div className='data-explorer__filters'>
        <h4 className='data-explorer__filters-title'>Filters</h4>
        {
          filterConfig ?
            <AggregationTabs
              filterConfig={filterConfig}
              {...this.props}
            />
            : <Aggregations {...this.props} />
        }
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
