import { logoutInactiveUsers, workspaceTimeoutInMinutes } from '../localconf';
import getReduxStore from '../reduxStore';
import { fetchUser, fetchUserAccess, fetchUserNoRefresh } from '../actions';

export function pageFromURL(currentURL) {
  const paths = currentURL
    .split('/')
    .filter((x) => x !== 'dev.html' && x !== '');
  return paths[paths.length - 1];
}

function isUserOnPage(pageName) {
  return pageFromURL(window.location.href) === pageName;
}

export class SessionMonitor {
  constructor(updateSessionTime, inactiveTimeLimit) {
    this.updateSessionTime = updateSessionTime || 5 * 60 * 1000;
    this.inactiveTimeLimit = inactiveTimeLimit || 30 * 60 * 1000;
    this.inactiveWorkspaceTimeLimit =
      Math.min(Number(workspaceTimeoutInMinutes), 480) * 60 * 1000;
    this.mostRecentActivityTimestamp = Date.now();
    this.interval = null;
    this.popupShown = false;
  }

  start() {
    if (this.interval) {
      // interval already started
      return;
    }
    window.addEventListener('mousedown', this.updateUserActivity, false);
    window.addEventListener('keypress', this.updateUserActivity, false);
    this.interval = setInterval(
      () => this.updateSession(),
      this.updateSessionTime
    ); // check session every X min
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      window.removeEventListener('mousedown', this.updateUserActivity, false);
      window.removeEventListener('keypress', this.updateUserActivity, false);
    }
  }

  updateUserActivity = () => {
    this.mostRecentActivityTimestamp = Date.now();
  };

  updateSession() {
    if (isUserOnPage('login')) {
      return Promise.resolve(0);
    }

    if (logoutInactiveUsers) {
      const inactiveTimeLimit = isUserOnPage('workspace')
        ? this.inactiveWorkspaceTimeLimit
        : this.inactiveTimeLimit;

      if (Date.now() - this.mostRecentActivityTimestamp >= inactiveTimeLimit) {
        // Allow Fence to log out the user.
        // If we don't refresh, Fence will mark them as inactive.
        this.notifyUserIfTheyAreNotLoggedIn();
        return Promise.resolve(0);
      }
    }

    return this.refreshSession();
  }

  refreshSession() {
    if (isUserOnPage('login')) {
      return Promise.resolve(0);
    }
    // hitting Fence endpoint refreshes token
    return getReduxStore().then((store) => {
      store.dispatch(fetchUser).then((response) => {
        if (response.type === 'UPDATE_POPUP') {
          this.popupShown = true;
        } else {
          store.dispatch(fetchUserAccess);
        }
      });
    });
  }

  notifyUserIfTheyAreNotLoggedIn() {
    /* If a logged-out user is browsing a page with ProtectedContent, this code will
     * display the popup that informs them their session has expired.
     * This function is similar to refreshSession() in that it checks user
     * auth (401/403 vs 200), but it does not refresh
     * the access token nor extend the session.
     */
    if (this.popupShown) {
      return;
    }

    getReduxStore().then((store) => {
      store.dispatch(fetchUserNoRefresh).then((response) => {
        if (response.type === 'UPDATE_POPUP') {
          this.popupShown = true;
        } else {
          store.dispatch(fetchUserAccess);
        }
      });
    });
  }
}

const singleton = new SessionMonitor();
export default singleton;
