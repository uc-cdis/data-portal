import React from 'react';
import _ from 'lodash';
import GuppyDataExplorer from './GuppyDataExplorer';
import { config } from '../params';
import { guppyUrl } from '../localconf';

const defaultConfig = {
  charts: {},
  filterConfig: { tabs: [] },
  tableConfig: [],
  guppyConfig: {
    dataType: 'subject',
    manifestMapping: {
      resourceIndexType: 'file',
      resourceIdField: 'file_id', // TODO: change to object_id
      referenceIdFieldInResourceIndex: 'subject_id',
      referenceIdFieldInDataIndex: 'subject_id', // TODO: change to node_id
    },
  },
  buttons: [],
  dropdowns: {},
};
const guppyExplorerConfig = _.merge(defaultConfig, config.dataExplorerConfig);

console.log('guppyExplorerConfig', guppyExplorerConfig);

class Explorer extends React.Component {
  render() {
    return (
      <GuppyDataExplorer
        chartConfig={guppyExplorerConfig.charts}
        filterConfig={guppyExplorerConfig.filterConfig}
        tableConfig={guppyExplorerConfig.tableConfig}
        guppyConfig={{ path: guppyUrl, ...guppyExplorerConfig.guppyConfig }}
        buttonConfig={{ buttons: guppyExplorerConfig.buttons, dropdowns: guppyExplorerConfig.dropdowns }}
      />
    );
  }
}

export default Explorer;
