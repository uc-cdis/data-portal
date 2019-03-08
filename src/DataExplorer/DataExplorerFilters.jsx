import React from 'react';
import PropTypes from 'prop-types';
import { Aggregations } from '@arranger/components/dist/Arranger';
import AggregationTabs from '../Arranger/AggregationTabs';

class DataExplorerFilters extends React.Component {
  render() {
    const filterConfig = this.props.dataExplorerConfig.filters;
    return (
      <div className='data-explorer__filters'>
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
  dataExplorerConfig: PropTypes.object,
};

DataExplorerFilters.defaultProps = {
  arrangerData: null,
  dataExplorerConfig: {},
};

export default DataExplorerFilters;
