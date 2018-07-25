import React from 'react';
import ArrangerWrapper from '../components/ArrangerWrapper';
import { CurrentSQON, Aggregations } from '@arranger/components/dist/Arranger';
import DataExplorerResults from './DataExplorerResults';
import SummaryChartGroup from '../components/charts/SummaryChartGroup';
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
          <Aggregations className="data-explorer__filters" />
          <DataExplorerResults />
      </ArrangerWrapper>
    </div>
    );
  }
}

export default DataExplorer;
