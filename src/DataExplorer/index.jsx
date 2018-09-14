import React from 'react';
import ArrangerWrapper from '../Arranger/ArrangerWrapper';
import DataExplorerFilters from './DataExplorerFilters';
import DataExplorerVisualizations from './DataExplorerVisualizations';
import { paramByApp } from '../../data/dictionaryHelper';
import { params } from '../../data/parameters';
import defaultApi from '../arrangerApi';
import './DataExplorer.less';

class DataExplorer extends React.Component {
  render() {
    const arrangerConfig = paramByApp(params, 'arrangerConfig') || {};
    const explorerTableConfig = arrangerConfig.table || {};
    return (
      <div className='data-explorer'>
        <ArrangerWrapper
          index={arrangerConfig.index}
          graphqlField={arrangerConfig.graphqlField}
          projectId={arrangerConfig.projectId}
          api={defaultApi}
        >
          <DataExplorerFilters arrangerConfig={arrangerConfig} api={defaultApi} />
          <DataExplorerVisualizations
            arrangerConfig={arrangerConfig}
            explorerTableConfig={explorerTableConfig}
            api={defaultApi}
          />
        </ArrangerWrapper>
      </div>
    );
  }
}

export default DataExplorer;
