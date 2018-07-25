import React from 'react';
import ArrangerWrapper from '../components/ArrangerWrapper';
import DataExplorerFilters from './DataExplorerFilters';
import DataExplorerResults from './DataExplorerResults';
import { paramByApp } from '../../data/dictionaryHelper';
import { params } from '../../data/parameters';
import './DataExplorer.less';

class DataExplorer extends React.Component {
  render() {
    const arrangerConfig = paramByApp(params, 'arrangerConfig') || {};
    return (
      <div className="data-explorer">
        <ArrangerWrapper
          api={'localhost:3000'}
          index={arrangerConfig.index}
          graphqlField={arrangerConfig.graphqlField}
          projectId={arrangerConfig.projectId}
        >
          <DataExplorerFilters />
          <DataExplorerResults arrangerConfig={arrangerConfig}/>
      </ArrangerWrapper>
    </div>
    );
  }
}

export default DataExplorer;
