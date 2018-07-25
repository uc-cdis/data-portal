import React from 'react';
import ArrangerWrapper from '../components/ArrangerWrapper';
import DataExplorerFilters from './DataExplorerFilters';
import DataExplorerResults from './DataExplorerResults';
import './DataExplorer.less';

class DataExplorer extends React.Component {
  render() {
    const index = '';
    const graphqlField = 'subject';
    const projectId = 'search';
    return (
      <div className="data-explorer">
        <ArrangerWrapper
          index={index}
          graphqlField={graphqlField}
          projectId={projectId}
        >
          <DataExplorerFilters />
          <DataExplorerResults />
      </ArrangerWrapper>
    </div>
    );
  }
}

export default DataExplorer;
