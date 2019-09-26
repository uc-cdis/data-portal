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

let guppyExplorerConfigs = [
  _.merge(defaultConfig, config.dataExplorerConfig),
  _.merge(defaultFileConfig, config.fileExplorerConfig),
];
let routes = [
  '/explorer',
  '/files',
];

const converNameToLink = (name) => {
  const linkName = name.replace(' ', '_').toLowerCase();
  return `/explorer/${linkName}`;
};
if (config.explorerConfigs) { // using new multi-tab configuration
  guppyExplorerConfigs = Object.keys(config.explorerConfigs)
    .map(tabName => config.explorerConfigs[tabName]);
  routes = Object.keys(config.explorerConfigs).map(tabName => converNameToLink(tabName));
}

class Explorer extends React.Component {
  constructor(props) {
    super(props);
    const tabIndex = routes.indexOf(props.location.pathname);
    this.state = {
      tab: tabIndex > 0 ? tabIndex : 0,
    };
  }

  changeTab(tabName, tabIndex) {
    const link = converNameToLink(tabName);
    this.props.history.push(link);
    this.setState({
      tab: tabIndex,
    });
  }


  render() {
    if (config.explorerConfigs) { // using new multi-tab configuration
      return (
        <div className='guppy-explorer'>
          {
            Object.keys(config.explorerConfigs).length > 1 ? (
              <div className='guppy-explorer__tabs'>
                {
                  Object.keys(config.explorerConfigs).map((tabName, tabIndex) => (
                    <div
                      key={tabIndex}
                      className={'guppy-explorer__tab'.concat(this.state.tab === tabIndex ? ' guppy-explorer__tab--selected' : '')}
                      onClick={() => this.changeTab(tabName, tabIndex)}
                      role='button'
                      tabIndex={0}
                    >
                      <h3>{tabName}</h3>
                    </div>
                  ))
                }
              </div>
            ) : null
          }
          <div className={Object.keys(config.explorerConfigs).length === 1 ? 'guppy-explorer__main' : ''}>
            <GuppyDataExplorer
              key={this.state.tab}
              chartConfig={guppyExplorerConfigs[this.state.tab].charts}
              filterConfig={guppyExplorerConfigs[this.state.tab].filters}
              tableConfig={guppyExplorerConfigs[this.state.tab].table}
              heatMapConfig={this.state.tab === 0 ? config.dataAvailabilityToolConfig : null}
              guppyConfig={{ path: guppyUrl, ...guppyExplorerConfigs[this.state.tab].guppyConfig }}
              buttonConfig={{
                buttons: guppyExplorerConfigs[this.state.tab].buttons,
                dropdowns: guppyExplorerConfigs[this.state.tab].dropdowns,
                terraExportURL: config.dataExplorerConfig.terraExportURL,
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
    return ( // for backward compatibable
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
            chartConfig={guppyExplorerConfigs[this.state.tab].charts}
            filterConfig={guppyExplorerConfigs[this.state.tab].filters}
            tableConfig={guppyExplorerConfigs[this.state.tab].table}
            heatMapConfig={this.state.tab === 0 ? config.dataAvailabilityToolConfig : null}
            guppyConfig={{ path: guppyUrl, ...guppyExplorerConfigs[this.state.tab].guppyConfig }}
            buttonConfig={{
              buttons: guppyExplorerConfigs[this.state.tab].buttons,
              dropdowns: guppyExplorerConfigs[this.state.tab].dropdowns,
              terraExportURL: config.dataExplorerConfig.terraExportURL,
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
