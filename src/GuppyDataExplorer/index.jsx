import React from 'react';
import GuppyDataExplorer from './GuppyDataExplorer';
import { config } from '../params';
import { guppyUrl } from '../localconf';

const guppyExplorerConfig = config.dataExplorerConfig || {
  charts: {},
  filterConfig: { tabs: [] },
  tableConfig: [],
  guppyConfig: {
    caseType: 'subject',
  },
};

console.log('guppyExplorerConfig', guppyExplorerConfig);

class Explorer extends React.Component {
  render() {
    return (
      <GuppyDataExplorer
        chartConfig={guppyExplorerConfig.charts}
        filterConfig={guppyExplorerConfig.filterConfig}
        tableConfig={guppyExplorerConfig.tableConfig}
        guppyConfig={{ path: guppyUrl, type: guppyExplorerConfig.guppyConfig.caseType }}
      />
    );
  }
}

export default Explorer;
