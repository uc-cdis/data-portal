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
  filters: { tabs: [] },
  table: {
    enabled: true,
    fields: [],
  },
  guppyConfig: {
    dataType: 'file',
    fieldMapping: [],
    manifestMapping: {
      resourceIndexType: 'subject',
      resourceIdField: 'subject_id',
      referenceIdFieldInResourceIndex: 'file_id', // TODO: change to object_id
      referenceIdFieldInDataIndex: 'file_id', // TODO: change to object_id
    },
  },
  buttons: [],
  dropdowns: {},
};

const guppyExplorerConfig = [
  _.merge(defaultConfig, config.dataExplorerConfig),
  _.merge(defaultFileConfig, config.fileExplorerConfig),
];

const routes = [
  '/explorer',
  '/files',
];

class Explorer extends React.Component {
  constructor(props) {
    super(props);
    const tabIndex = routes.indexOf(props.location.pathname);
    this.state = {
      tab: tabIndex > 0 ? tabIndex : 0,
    };
  }

  render() {
    return (
      <div className='guppy-explorer'>
        {
          config.fileExplorerConfig ? (
            <div className='guppy-explorer__tabs'>
              <div
                className={'guppy-explorer__tab'.concat(this.state.tab === 0 ? ' guppy-explorer__tab--selected' : '')}
                onClick={() => this.props.history.push('/explorer')}
                role='button'
                tabIndex={0}
              >
                <h3>Data</h3>
              </div>
              <div
                className={'guppy-explorer__tab'.concat(this.state.tab === 1 ? ' guppy-explorer__tab--selected' : '')}
                onClick={() => this.props.history.push('/files')}
                role='button'
                tabIndex={-1}
              >
                <h3>Files</h3>
              </div>
            </div>
          ) : null
        }
        <div className={config.fileExplorerConfig ? 'guppy-explorer__main' : ''}>
          <GuppyDataExplorer
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
  location: PropTypes.object.isRequired,
};

export default Explorer;
