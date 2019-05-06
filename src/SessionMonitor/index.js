import { userapiPath, logoutInactiveUsers, submissionApiPath } from '../localconf';
import getReduxStore from '../reduxStore';
import { logoutAPI, logoutUserWithoutRedirect, fetchUser, fetchUserNoRefresh } from '../actions';


/* eslint-disable class-methods-use-this */
export class SessionMonitor {
  constructor(updateSessionTime, inactiveTimeLimit) {
    this.updateSessionTime = updateSessionTime || 0.05 * 60 * 1000;
    this.checkIfUserLoggedInInterval = 5 * 60 * 1000;
    this.inactiveTimeLimit = inactiveTimeLimit || 0.2 * 60 * 1000;
    this.mostRecentActivityTimestamp = Date.now();
    this.mostRecentLogoutTime = Date.now();
    this.allowedTimeBetweenLogoutCalls =  1 * 60 * 1000;
    this.fenceInterval = null;
    this.sheepdogInterval = null;
    this.popupShown = false;
  }

  start() {
    if (this.fenceInterval) { // interval already started
      return;
    }
    window.addEventListener('mousedown', () => this.updateUserActivity(), false);
    window.addEventListener('keypress', () => this.updateUserActivity(), false);
    this.fenceInterval = setInterval(
      () => this.updateSession(),
      this.updateSessionTime,
    ); // check session every X min

    this.startUserLoginCheck();
  }

  stop() {
    if (this.fenceInterval) {
      clearInterval(this.fenceInterval);
      window.removeEventListener('mousedown', this.updateUserActivity(), false);
      window.removeEventListener('keypress', this.updateUserActivity(), false);
    }

    this.stopUserLoginCheck();
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
    const timeSinceLastLogout = Date.now() - this.mostRecentLogoutTime;
    const paths = window.location.href.split('/').filter(x => x !== 'dev.html');
    const userIsInWorkspace = paths[paths.length - 1] === 'workspace';
    // If user has been inactive for Y min, and they are not in a workspace
    if (timeSinceLastActivity >= this.inactiveTimeLimit && !userIsInWorkspace
        && timeSinceLastLogout > this.allowedTimeBetweenLogoutCalls 
        && logoutInactiveUsers) {
      // Allow Fence to log out the user. If we don't refresh, Fence will mark them as inactive.
      this.notifyUserIfTheyAreNotLoggedIn();
      return Promise.resolve(0);
    }

    return this.refreshSession();
  }

  refreshSession() {
    console.log('refreshing...');

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

  startUserLoginCheck() {
    // Only start sheepdog check if we won't be logging out inactive users -- 
    // in the case where the user has been inactive, we'll need the sheepdog
    // check to see if they're logged out without refreshing their token
    // (because hitting Fence refreshes their token)
    if(!this.sheepdogInterval && !logoutInactiveUsers) {
      this.sheepdogInterval = setInterval(
        () => this.checkIfUserLoggedIn(),
        this.checkIfUserLoggedInInterval,
      );
    }
  }

  stopUserLoginCheck() {
    if (this.sheepdogInterval) {
      clearInterval(this.sheepdogInterval);
      window.removeEventListener('mousedown', this.updateUserActivity(), false);
      window.removeEventListener('keypress', this.updateUserActivity(), false);
    }
  }

  notifyUserIfTheyAreNotLoggedIn() {
    // If the user is browsing a page with ProtectedContent, this code will
    // display the popup that informs them their session has expired.
    if(this.popupShown) {
      return;
    }
    
    var _this = this;
    getReduxStore().then((store) => {
      store.dispatch(fetchUserNoRefresh).then((response) => { 
        console.log(response);
        if(response.type == "UPDATE_POPUP") {
          _this.popupShown = true;
        }
      });
    });
  }
}

const singleton = new SessionMonitor();
export default singleton;
