import React from 'react';
import ArrangerWrapper from '../Arranger/ArrangerWrapper';
import DataExplorerFilters from './DataExplorerFilters';
import DataExplorerVisualizations from './DataExplorerVisualizations';
import arrangerApi from '../Arranger/utils';
import { config } from '../params';
import { loginPath, userapiPath } from '../localconf';
import './DataExplorer.less';

class DataExplorer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mostRecentActivityTimestamp: Date.now() };
  }

  componentDidMount() {
    window.addEventListener('mousedown', this.updateUserActivity, false);
    window.addEventListener('keypress', this.updateUserActivity, false);
    setTimeout(this.refreshSession, 6000);
  }

  updateUserActivity = () => {
    this.setState({ mostRecentActivityTimestamp: Date.now() });
  }

  refreshSession = () => {
    if (Date.now() - this.state.mostRecentActivityTimestamp > 18000) { // If 30 min have passed
      window.location = loginPath;
    } else {
      fetch(userapiPath); // hitting Fence endpoint refreshes token
      setTimeout(this.refreshSession, 6000);
    }
  }

  render() {
    const arrangerConfig = config.arrangerConfig || {};
    const explorerTableConfig = arrangerConfig.table || {};
    return (
      <div className='data-explorer'>
        <ArrangerWrapper
          index={arrangerConfig.index}
          graphqlField={arrangerConfig.graphqlField}
          projectId={arrangerConfig.projectId}
          api={arrangerApi}
        >
          <DataExplorerFilters arrangerConfig={arrangerConfig} api={arrangerApi} />
          <DataExplorerVisualizations
            arrangerConfig={arrangerConfig}
            explorerTableConfig={explorerTableConfig}
            api={arrangerApi}
          />
        </ArrangerWrapper>
      </div>
    );
  }
}

export default DataExplorer;
