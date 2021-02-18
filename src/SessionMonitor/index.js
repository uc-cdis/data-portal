import { logoutInactiveUsers, workspaceTimeoutInMinutes } from '../localconf';
import getReduxStore from '../reduxStore';
import { fetchUser, logoutAPI } from '../actions';

export class SessionMonitor {
  constructor(updateSessionTime, inactiveTimeLimit) {
    this.updateSessionTime = updateSessionTime || 1 * 60 * 1000;
    this.updateSessionLimit = 5 * 60 * 1000;
    this.inactiveTimeLimit = inactiveTimeLimit || 8 * 60 * 1000;
    this.inactiveWorkspaceTimeLimit = Math.min(workspaceTimeoutInMinutes, 10) * 60 * 1000;
    this.mostRecentSessionRefreshTimestamp = Date.now();
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

  logoutUser() {
    if (this.popupShown) {
      return;
    }

    console.log('logging out user at: ', new Date());
    getReduxStore().then((store) => {
      console.log('handleInactiveUserLogout dispatched at: ', new Date());
      store.dispatch(logoutAPI(true))
      this.popupShown = true;
    });
  }

  updateUserActivity() {
    this.mostRecentActivityTimestamp = Date.now();
  }

  pageFromURL(currentURL) {
    const paths = currentURL.split('/').filter(x => x !== 'dev.html' && x !== '');
    return paths[paths.length - 1];
  }

  isUserOnPage(pageName) {
    return this.pageFromURL(window.location.href) === pageName;
  }

  updateSession() {
    if (this.isUserOnPage('login') || this.popupShown) {
      return Promise.resolve(0);
    }

    console.log('user session updated at: ', new Date());
    console.log('last user interaction at: ', new Date(this.mostRecentActivityTimestamp));

    const timeSinceLastActivity = Date.now() - this.mostRecentActivityTimestamp;
    // If user has been inactive for Y min, and they are not in a workspace
    if (timeSinceLastActivity >= this.inactiveTimeLimit
        && !this.isUserOnPage('workspace')
        && logoutInactiveUsers) {
      this.logoutUser();
      return Promise.resolve(0);
    }

    // If the user has been inactive for this.inactiveWorkspaceTimeLimit minutes
    // and they *are* in a workspace
    if (timeSinceLastActivity >= this.inactiveWorkspaceTimeLimit
        && this.isUserOnPage('workspace')
        && logoutInactiveUsers) {
      this.logoutUser();
      return Promise.resolve(0);
    }

    return this.refreshSession();
  }

  refreshSession() {
    const timeSinceLastSessionUpdate = Date.now() - this.mostRecentSessionRefreshTimestamp;
    if (timeSinceLastSessionUpdate < this.updateSessionLimit) {
      console.log('too soon');
      return Promise.resolve(0);
    }

    // hitting Fence endpoint refreshes token
    console.log('session refreshed at: ', new Date());
    this.mostRecentSessionRefreshTimestamp = Date.now();
    return getReduxStore().then((store) => {
      store.dispatch(fetchUser).then((response) => {
        if (response.type === 'UPDATE_POPUP') {
          this.popupShown = true;
        }
      }).catch(() => {
        // if API failed check if user is still logged in
        this.notifyUserIfTheyAreNotLoggedIn();
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
      store.dispatch(fetchUser).then((response) => {
        if (response.type === 'UPDATE_POPUP') {
          this.popupShown = true;
        }
      });
    });
  }
}

const singleton = new SessionMonitor();
export default singleton;
