import { logoutInactiveUsers, workspaceTimeoutInMinutes } from '../localconf';
import getReduxStore from '../reduxStore';
import { fetchUser, logoutAPI } from '../actions';

// Updated SessionMonitor logic as of 02/18/2021
// Before: Portal relies on Fence token expiration to decide if user has logged out (passive)
// After: Portal will keeps tracking of user's interaction and actively log out user if
// the inactive time has passed the pre-set threshold
// Why this change: in before only the Fence session token in cookie is updated when hitting `/user`
// and the access token in cookie can only gets updated after the current one has expired.
// This will result in varies ill-behaviors of Portal (eg. requests get 401 when
// user is still active, or Portal displayed the AuthPopup to user but user can still be
// logged in if they just refresh the page). After the Fence patch, both session
// and access token in cookies will get updated if user session is still valid.
// So Portal must actively track and log out inactive users.
export class SessionMonitor {
  constructor(updateSessionTime, inactiveTimeLimit) {
    // time interval for checking if user is inactive
    this.updateSessionTime = updateSessionTime || 1 * 60 * 1000;
    // time interval for calling /user to refresh user's tokens
    this.updateSessionLimit = 5 * 60 * 1000;
    this.inactiveTimeLimit = inactiveTimeLimit || 30 * 60 * 1000;
    this.inactiveWorkspaceTimeLimit = Math.min(workspaceTimeoutInMinutes, 480) * 60 * 1000;
    this.mostRecentSessionRefreshTimestamp = Date.now();
    this.mostRecentActivityTimestamp = Date.now();
    this.interval = null;
    this.logoutPopupShown = false;
    this.inactivityWarningPopupShown = false;
    this.inactiveWarningTime = 5 * 60 * 1000; // 5 min
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
    ); // check session every X min, according to the updateSessionTime value
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      window.removeEventListener('mousedown', this.updateUserActivity(), false);
      window.removeEventListener('keypress', this.updateUserActivity(), false);
    }
  }

  logoutUser() {
    // don't hit the logout endpoint over and over if the popup is already shown
    if (this.logoutPopupShown) {
      return;
    }

    getReduxStore().then((store) => {
      store.dispatch(logoutAPI(true));
      this.logoutPopupShown = true;
    });
  }

  warnUser(warnTime) {
    // don't hit the logout endpoint over and over if the popup is already shown
    if (this.inactivityWarningPopupShown) {
      return;
    }

    getReduxStore().then((store) => {
      store.dispatch({
        type: 'UPDATE_POPUP',
        data: {
          inactivityWarningPopup: true,
          inactivityWarningTime: warnTime,
        },
      });
      this.inactivityWarningPopupShown = true;
    });
  }

  updateUserActivity() {
    this.mostRecentActivityTimestamp = Date.now();
    // clear warning popup state
    this.inactivityWarningPopupShown = false;
  }

  static pageFromURL(currentURL) {
    const paths = currentURL.split('/').filter((x) => x !== 'dev.html' && x !== '');
    return paths[paths.length - 1];
  }

  static isUserOnPage(pageName) {
    return SessionMonitor.pageFromURL(window.location.href) === pageName;
  }

  updateSession() {
    const afterUserCheck = () => {
      const timeSinceLastActivity = Date.now() - this.mostRecentActivityTimestamp;
      // If user has been inactive for Y min, and they are not in a workspace
      if (timeSinceLastActivity >= this.inactiveTimeLimit
          && !SessionMonitor.isUserOnPage('workspace')
          && logoutInactiveUsers) {
        this.logoutUser();
        return Promise.resolve(0);
      }

      // If the user has been inactive for this.inactiveWorkspaceTimeLimit minutes
      // and they *are* in a workspace
      if (timeSinceLastActivity >= this.inactiveWorkspaceTimeLimit
          && SessionMonitor.isUserOnPage('workspace')
          && logoutInactiveUsers) {
        this.logoutUser();
        return Promise.resolve(0);
      }

      // If user has been inactive for Y min, and they are not in a workspace
      // trigger warning popup
      if (timeSinceLastActivity >= (this.inactiveTimeLimit - this.inactiveWarningTime)
          && !SessionMonitor.isUserOnPage('workspace')
          && logoutInactiveUsers) {
        this.warnUser(this.mostRecentActivityTimestamp + this.inactiveTimeLimit);
        return Promise.resolve(0);
      }

      // If the user has been inactive for this.inactiveWorkspaceTimeLimit minutes
      // and they *are* in a workspace
      // trigger warning popup
      if (timeSinceLastActivity >= (this.inactiveWorkspaceTimeLimit - this.inactiveWarningTime)
          && SessionMonitor.isUserOnPage('workspace')
          && logoutInactiveUsers) {
        this.warnUser(this.mostRecentActivityTimestamp + this.inactiveWorkspaceTimeLimit);
        return Promise.resolve(0);
      }

      return this.refreshSession();
    }

    if (SessionMonitor.isUserOnPage('login') || this.logoutPopupShown) {
      return Promise.resolve(0);
    }

    // check if user is logged in for logout warnings
    return getReduxStore().then((store) => {
      if (!store?.getState()?.user?.username) {
        return Promise.resolve(0);
      }
      return afterUserCheck();
    });

  }

  refreshSession() {
    const timeSinceLastSessionUpdate = Date.now() - this.mostRecentSessionRefreshTimestamp;
    // don't hit Fence to refresh tokens too frequently
    if (timeSinceLastSessionUpdate < this.updateSessionLimit) {
      return Promise.resolve(0);
    }

    // hitting Fence endpoint refreshes token
    this.mostRecentSessionRefreshTimestamp = Date.now();
    return getReduxStore().then((store) => {
      store.dispatch(fetchUser).then((response) => {
        // usually we shouldn't get this
        if (response.type === 'UPDATE_POPUP') {
          this.logoutPopupShown = true;
        }
      });
    });
  }
}

const singleton = new SessionMonitor();
export default singleton;
