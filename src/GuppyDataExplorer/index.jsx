import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import GuppyDataExplorer from './GuppyDataExplorer';
import { config } from '../params';
import { guppyUrl, tierAccessLevel, tierAccessLimit } from '../localconf';
import './GuppyExplorer.css';

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

const defaultFileConfig = {
  charts: {},
  filters: {
    tabs: [
      {
        title: 'File',
        fields: [
          'project_id',
          'data_type',
          'data_format',
        ]
      },
    ]
  },
  table: {
    enabled: true,
    fields: [ 'project_id', 'file_name', 'file_size', 'object_id' ],
  },
  guppyConfig: {
    dataType: "file",
    fieldMapping: [
      { field: 'object_id', "name": 'GUID' },
    ],
    nodeCountTitle: "Files",
    manifestMapping: {
      resourceIndexType: "case",
      resourceIdField: "case_id",
      referenceIdFieldInResourceIndex: "object_id",
      referenceIdFieldInDataIndex: "object_id"
    },
    accessibleFieldCheckList: ["project_id"],
    accessibleValidationField: "project_id",
    downloadAccessor: "object_id",
  },
  buttons: [],
  dropdowns: {},
};

const guppyExplorerConfig = [
  _.merge(defaultConfig, config.dataExplorerConfig),
  defaultFileConfig
];

class Explorer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
    };
  }

  toggleTab = tab => {
    this.setState({ tab });
  }

  render() {
    return (
      <div className='guppy-explorer'>
        <div className='guppy-explorer__tabs'>
          <div className={'guppy-explorer__tab'.concat(this.state.tab === 0 ? ' guppy-explorer__tab--selected' : '')} onClick={() => this.toggleTab(0)}>
            <h3>Data</h3>
          </div>
          <div className={'guppy-explorer__tab'.concat(this.state.tab === 1 ? ' guppy-explorer__tab--selected' : '')} onClick={() => this.toggleTab(1)}>
            <h3>Files</h3>
          </div>
        </div>
        <div className='guppy-explorer__main'>
          <GuppyDataExplorer
            key={this.state.tab}
            chartConfig={guppyExplorerConfig[this.state.tab].charts}
            filterConfig={guppyExplorerConfig[this.state.tab].filters}
            tableConfig={guppyExplorerConfig[this.state.tab].table}
            guppyConfig={{ path: guppyUrl, ...guppyExplorerConfig[this.state.tab].guppyConfig }}
            buttonConfig={{
              buttons: guppyExplorerConfig[this.state.tab].buttons,
              dropdowns: guppyExplorerConfig[this.state.tab].dropdowns,
            }}
            history={this.props.history}
            tierAccessLevel={tierAccessLevel}
            tierAccessLimit={tierAccessLimit}
            getAccessButtonLink={config.dataExplorerConfig.getAccessButtonLink}
          />
        </div>
      </div>
    );
  }
}

Explorer.propTypes = {
  history: PropTypes.object.isRequired, // inherited from ProtectedContent
};

export default Explorer;
