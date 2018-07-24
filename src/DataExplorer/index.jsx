import React from 'react';
import { Arranger, CurrentSQON, Aggregations } from '@arranger/components/dist/Arranger';
import { flattenAggregations } from '@arranger/middleware';
import DataExplorerTable from '../components/tables/DataExplorerTable/.';
import { components } from '../params';
import { fetchDataForArrangerTable } from '../actions';
import './DataExplorer.less';

class DataExplorer extends React.Component {
  render() {
    const tableProperties = components.dataExplorerTableProperties;
    return (
      <Arranger
        index={''}
        graphqlField={'subject'}
        projectId={'v1'}
        render={props => {

          return (
            <div className='data-explorer'>
              <div className='data-explorer__filters'>
                <Aggregations {...props} />
              </div>
              <div className='data-explorer__results'>
                <CurrentSQON {...props} />
                <Charts {...props} />
                <DataExplorerTable {...props} />
              </div>
            </div>
          );
        }}
      />
    );
  }
}

export default DataExplorer;
