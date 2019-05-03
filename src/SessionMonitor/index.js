import { userapiPath } from '../localconf';
import getReduxStore from '../reduxStore';
import { logoutApi, logoutUserWithoutRedirect, fetchUser } from '../actions';


/* eslint-disable class-methods-use-this */
export class SessionMonitor {
  constructor(updateSessionTime, inactiveTimeLimit) {
    this.updateSessionTime = updateSessionTime || 1 * 60 * 1000;
    this.inactiveTimeLimit = inactiveTimeLimit || 0.2 * 60 * 1000;
    this.mostRecentActivityTimestamp = Date.now();
    this.mostRecentLogoutTime = Date.now();
    this.allowedTimeBetweenLogoutCalls =  0.01 * 60 * 1000;
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
    console.log('updateUserActivity');
    this.mostRecentActivityTimestamp = Date.now();
  }

  updateSession() {
    const timeSinceLastActivity = Date.now() - this.mostRecentActivityTimestamp;
    const timeSinceLastLogout = Date.now() - this.mostRecentLogoutTime;
    const paths = window.location.href.split('/').filter(x => x !== 'dev.html');
    const userIsInWorkspace = paths[paths.length - 1] === 'workspace';
    console.log('timeSinceLastLogout: ', timeSinceLastLogout);
    console.log('allowed time: ', this.allowedTimeBetweenLogoutCalls);

    // If user has been inactive for Y min, and they are not in a workspace
    if (timeSinceLastActivity >= this.inactiveTimeLimit && !userIsInWorkspace
        && timeSinceLastLogout > this.allowedTimeBetweenLogoutCalls ) {
      this.logoutUser();
      this.mostRecentLogoutTime = Date.now();
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
    var _this = this;
    if(!this.popupShown) {
      getReduxStore().then((store) => {
        store.dispatch(fetchUser);
        _this.popupShown = true;
      });
    }
  }
  //logoutUserWithoutRedirect()
  logoutUser() {
    console.log('sessionMonitor logoutUser');
    var _this = this;
    getReduxStore().then((store) => {
      store.dispatch(logoutUserWithoutRedirect()).then(function(response) {
        console.log('session monitor 81: ', response);
        _this.refreshSession();
        console.log('on 88');
      });   
      // store.dispatch(logoutAPI());
    });
  }
}

const singleton = new SessionMonitor();
export default singleton;
