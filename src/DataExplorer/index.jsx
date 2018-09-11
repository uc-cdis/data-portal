import React from 'react';
import ArrangerWrapper from '../Arranger/ArrangerWrapper';
import DataExplorerFilters from './DataExplorerFilters';
import DataExplorerVisualizations from './DataExplorerVisualizations';
import { paramByApp } from '../../data/dictionaryHelper';
import { params } from '../../data/parameters';
import './DataExplorer.less';

class DataExplorer extends React.Component {
  render() {
    const arrangerConfig = paramByApp(params, 'arrangerConfig') || {};
    return (
      <div className='data-explorer'>
        <ArrangerWrapper
          index={arrangerConfig.index}
          graphqlField={arrangerConfig.graphqlField}
          projectId={arrangerConfig.projectId}
        >
          <DataExplorerFilters arrangerConfig={arrangerConfig} />
          <DataExplorerVisualizations
            arrangerConfig={arrangerConfig}
            explorerTableConfig={arrangerConfig.table}
          />
        </ArrangerWrapper>
      </div>
    );
  }
}

export default DataExplorer;
