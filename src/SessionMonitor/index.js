import { userapiPath } from '../localconf';
import getReduxStore from '../reduxStore';
import { logoutAPI, fetchUser } from '../actions';


/* eslint-disable class-methods-use-this */
export class SessionMonitor {
  constructor(updateSessionTime, inactiveTimeLimit) {
    this.updateSessionTime = updateSessionTime || 5 * 60 * 1000;
    this.inactiveTimeLimit = inactiveTimeLimit || 60 * 60 * 1000;
    this.mostRecentActivityTimestamp = Date.now();
    this.mostRecentLogoutTime = Date.now();
    this.allowedTimeBetweenLogoutCalls =  0.1 * 60 * 1000;
    this.interval = null;
    this.protectedContentComponent = null;
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
      return Promise.resolve(0);
    } else if (Date.now() - this.mostRecentActivityTimestamp < this.inactiveTimeLimit) {
      return this.refreshSession();
    } else {
      console.log('Error calculating inactive time');
      return Promise.resolve(0);
    }
  }

  refreshSession() {
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
    getReduxStore().then((store) => {
      store.dispatch(fetchUser)
    });
  }

  logoutUser() {
    getReduxStore().then((store) => {
      store.dispatch(logoutAPI());
    });
  }
}

const singleton = new SessionMonitor();
export default singleton;
