import React from 'react';
import PropTypes from 'prop-types';
import { loginPath, userapiPath } from '../localconf';
import getReduxStore from '../reduxStore';
import { logoutAPI } from '../actions';

class SessionMonitor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mostRecentActivityTimestamp: Date.now() };
  }

  componentDidMount() {
    window.addEventListener('mousedown', this.updateUserActivity, false);
    window.addEventListener('keypress', this.updateUserActivity, false);
    setTimeout(this.refreshSession, this.props.refreshSessionTime); // check session every X min
  }

  updateUserActivity = () => {
    this.setState({ mostRecentActivityTimestamp: Date.now() });
  }

  refreshSession = () => {
    if (Date.now() - this.state.mostRecentActivityTimestamp > this.props.inactiveTimeLimit) { // If user has been inactive for Y min
      getReduxStore().then(store => {
        store.dispatch(logoutAPI())
      });
    } else {
      fetch(userapiPath); // hitting Fence endpoint refreshes token
      setTimeout(this.refreshSession, this.props.refreshSessionTime);
    }
  }

  render() {
    return (
      <React.Fragment />
    );
  }
}

SessionMonitor.propTypes = {
  refreshSessionTime: PropTypes.number,
  inactiveTimeLimit: PropTypes.number,
};

SessionMonitor.defaultProps = {
  refreshSessionTime: 600000,
  inactiveTimeLimit: 1800000,
};

export default SessionMonitor;
