import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import GuppyDataExplorer from './GuppyDataExplorer';
import { config } from '../params';
import { guppyUrl, tierAccessLevel, tierAccessLimit } from '../localconf';

const defaultConfig = {
  charts: {},
  filters: { tabs: [] },
  table: {
    enabled: true,
    fields: [],
  },
  guppyConfig: {
    dataType: 'subject',
    fieldMapping: [],
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

class Explorer extends React.Component {
  render() {
    return (
      <GuppyDataExplorer
        chartConfig={guppyExplorerConfig.charts}
        filterConfig={guppyExplorerConfig.filters}
        tableConfig={guppyExplorerConfig.table}
        guppyConfig={{ path: guppyUrl, ...guppyExplorerConfig.guppyConfig }}
        buttonConfig={{
          buttons: guppyExplorerConfig.buttons,
          dropdowns: guppyExplorerConfig.dropdowns,
        }}
        history={this.props.history}
        tierAccessLevel={tierAccessLevel}
        tierAccessLimit={tierAccessLimit}
      />
    );
  }
}

Explorer.propTypes = {
  history: PropTypes.object.isRequired, // inherited from ProtectedContent
};

export default Explorer;
