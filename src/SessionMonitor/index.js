import { userapiPath } from '../localconf';
import getReduxStore from '../reduxStore';
import { logoutAPI } from '../actions';

/* eslint-disable class-methods-use-this */
export class SessionMonitor {
  constructor(updateSessionTime, inactiveTimeLimit) {
    this.updateSessionTime = updateSessionTime || 10 * 60 * 1000;
    this.inactiveTimeLimit = inactiveTimeLimit || 30 * 60 * 1000;
    this.mostRecentActivityTimestamp = Date.now();
    this.interval = null;
  }

  start() {
    if (this.interval) { // interval already started
      return;
    }
    window.addEventListener('mousedown', () => this.updateUserActivity(), false);
    window.addEventListener('keypress', () => this.updateUserActivity(), false);
    this.interval = setInterval(
      () => this.updateSession(),
      this.updateSessionTime,
    ); // check session every X min
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      window.removeEventListener('mousedown', this.updateUserActivity(), false);
      window.removeEventListener('keypress', this.updateUserActivity(), false);
    }
  }

  updateUserActivity() {
    this.mostRecentActivityTimestamp = Date.now();
  }

  updateSession() {
    // If user has been inactive for Y min
    if (Date.now() - this.mostRecentActivityTimestamp >= this.inactiveTimeLimit) {
      this.logoutUser();
    } else if (Date.now() - this.mostRecentActivityTimestamp < this.inactiveTimeLimit) {
      this.refreshSession();
    } else {
      console.log('Error calculating inactive time');
    }
  }

  refreshSession() {
    // hitting Fence endpoint refreshes token
    fetch(userapiPath);
  }

  logoutUser() {
    getReduxStore().then((store) => {
      store.dispatch(logoutAPI());
    });
  }
}

const singleton = new SessionMonitor();
export default singleton;
