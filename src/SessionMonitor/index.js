import { userapiPath, logoutInactiveUsers, submissionApiPath } from '../localconf';
import getReduxStore from '../reduxStore';
import { logoutAPI, logoutUserWithoutRedirect, fetchUser, fetchUserNoRefresh } from '../actions';


/* eslint-disable class-methods-use-this */
export class SessionMonitor {
  constructor(updateSessionTime, inactiveTimeLimit) {
    this.updateSessionTime = updateSessionTime || 0.05 * 60 * 1000;
    this.inactiveTimeLimit = inactiveTimeLimit || 30 * 60 * 1000;
    this.mostRecentActivityTimestamp = Date.now();
    this.interval = null;
    this.popupShown = false;
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

  isUserOnPage(pageName) {
    const paths = window.location.href.split('/').filter(x => x !== 'dev.html');
    return paths[paths.length - 1] === pageName;
  }

  updateSession() {
    if (this.isUserOnPage('login')) {
      return;
    }
    
    const timeSinceLastActivity = Date.now() - this.mostRecentActivityTimestamp;
    // If user has been inactive for Y min, and they are not in a workspace
    if (timeSinceLastActivity >= this.inactiveTimeLimit 
        && !this.isUserOnPage('workspace')
        && logoutInactiveUsers) {
      // Allow Fence to log out the user. If we don't refresh, Fence will mark them as inactive.
      this.notifyUserIfTheyAreNotLoggedIn();
      return Promise.resolve(0);
    }

    return this.refreshSession();
  }

  refreshSession() {
    if (this.isUserOnPage('login')) {
      return;
    }
    // hitting Fence endpoint refreshes token
    var _this = this;
    return fetch(`${userapiPath}user/`).then(function(response, data) {
      if (response.status == 401 || response.status == 403) {
        _this.notifyUserIfTheyAreNotLoggedIn();
      }
      return response;
    });
  }

  checkIfUserLoggedIn() {
    return fetch(`${submissionApiPath}`).then(function(response, data) {
      if (response.status == 401 || response.status == 403) {
        _this.notifyUserIfTheyAreNotLoggedIn();
      }
      return response;
    });
  }

  notifyUserIfTheyAreNotLoggedIn() {
    /* If the user is browsing a page with ProtectedContent, this code will
     * display the popup that informs them their session has expired. */
    if(this.popupShown) {
      return;
    }
    
    var _this = this;
    getReduxStore().then((store) => {
      store.dispatch(fetchUserNoRefresh).then((response) => { 
        if(response.type == "UPDATE_POPUP") {
          _this.popupShown = true;
        }
      });
    });
  }
}

const singleton = new SessionMonitor();
export default singleton;
