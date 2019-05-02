import { userapiPath } from '../localconf';
import getReduxStore from '../reduxStore';
import { logoutAPI, fetchUser } from '../actions';


/* eslint-disable class-methods-use-this */
export class SessionMonitor {
  constructor(updateSessionTime, inactiveTimeLimit) {
    this.updateSessionTime = updateSessionTime || 0.05 * 60 * 1000;
    this.inactiveTimeLimit = inactiveTimeLimit || 1 * 60 * 1000;
    this.mostRecentActivityTimestamp = Date.now();
    this.mostRecentLogoutTime = Date.now();
    this.allowedTimeBetweenLogoutCalls =  0.1 * 60 * 1000;
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
    console.log('updateUserActivity');
    this.mostRecentActivityTimestamp = Date.now();
  }

  updateSession() {
    const timeSinceLastActivity = Date.now() - this.mostRecentActivityTimestamp;
    const paths = window.location.href.split('/').filter(x => x !== 'dev.html');
    const userIsInWorkspace = paths[paths.length - 1] === 'workspace';
    console.log('in workspace: ', userIsInWorkspace);

    // If user has been inactive for Y min, and they are not in a workspace
    if (timeSinceLastActivity >= this.inactiveTimeLimit && !userIsInWorkspace) {
      this.logoutUser();
      return Promise.resolve(0);
    }
    return this.refreshSession();
  }

  refreshSession() {
    console.log('sessionMonitor refreshSession');
    // hitting Fence endpoint refreshes token
    var _this = this;
    return fetch(`${userapiPath}user/`).then(function(response, data) {
      if (response.status == 401 || response.status == 403) {
        _this.notifyUserTheyAreNotLoggedIn();
      }
      return response;
    });
  }

  notifyUserTheyAreNotLoggedIn() {
    // If the user is browsing a page with ProtectedContent, this code will
    // display the popup that informs them their session has expired.
    console.log('sessionMonitor -- showing popup');
    getReduxStore().then((store) => {
      store.dispatch(fetchUser)
    });
  }

  logoutUser() {
    console.log('sessionMonitor logoutUser');
    getReduxStore().then((store) => {
      store.dispatch(logoutAPI());
    });
  }
}

const singleton = new SessionMonitor();
export default singleton;
