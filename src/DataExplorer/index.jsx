import React from 'react';
import ArrangerWrapper from '../Arranger/ArrangerWrapper';
import DataExplorerFilters from './DataExplorerFilters';
import DataExplorerVisualizations from './DataExplorerVisualizations';
import arrangerApi from '../Arranger/utils';
import { config } from '../params';
import './DataExplorer.less';

class DataExplorer extends React.Component {
  render() {
    const arrangerConfig = config.arrangerConfig || {};
    const explorerTableConfig = arrangerConfig.table || {};
    return (
      <div className='data-explorer'>
        <ArrangerWrapper
          index={arrangerConfig.index}
          graphqlField={arrangerConfig.graphqlField}
          projectId={arrangerConfig.projectId}
          api={arrangerApi}
          charts={arrangerConfig.charts}
        >
          <DataExplorerFilters arrangerConfig={arrangerConfig} api={arrangerApi} />
          <DataExplorerVisualizations
            arrangerConfig={arrangerConfig}
            explorerTableConfig={explorerTableConfig}
            api={arrangerApi}
          />
        </ArrangerWrapper>
      </div>
    );
  }
}

export default DataExplorer;
