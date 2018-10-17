import React from 'react';
import PropTypes from 'prop-types';
import ArrangerWrapper from '../Arranger/ArrangerWrapper';
import DataExplorerFilters from './DataExplorerFilters';
import DataExplorerVisualizations from './DataExplorerVisualizations';
import arrangerApi from '../Arranger/utils';
import { config } from '../params';
import { loginPath, userapiPath } from '../localconf';
import getReduxStore from '../reduxStore';
import { logoutAPI } from '../actions';
import './DataExplorer.less';

class DataExplorer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mostRecentActivityTimestamp: Date.now() };
  }

  componentDidMount() {
    window.addEventListener('mousedown', this.updateUserActivity, false);
    window.addEventListener('keypress', this.updateUserActivity, false);
    setTimeout(this.refreshSession, this.props.refreshSessionTime); // check session every 10 min
  }

  updateUserActivity = () => {
    this.setState({ mostRecentActivityTimestamp: Date.now() });
  }

  refreshSession = () => {
    if (Date.now() - this.state.mostRecentActivityTimestamp > this.props.inactiveTimeLimit) { // If 30 min have passed
      getReduxStore().then(store => {
        store.dispatch(logoutAPI())
      });
    } else {
      fetch(userapiPath); // hitting Fence endpoint refreshes token
      setTimeout(this.refreshSession, this.props.refreshSessionTime);
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

DataExplorer.propTypes = {
  refreshSessionTime: PropTypes.number,
  inactiveTimeLimit: PropTypes.number,
};

DataExplorer.defaultProps = {
  refreshSessionTime: 600000,
  inactiveTimeLimit: 1800000,
};

export default DataExplorer;
