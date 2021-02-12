import { logoutInactiveUsers, workspaceTimeoutInMinutes } from '../localconf';
import getReduxStore from '../reduxStore';
import { fetchUser, fetchUserNoRefresh } from '../actions';

/* eslint-disable class-methods-use-this */
export class SessionMonitor {
  constructor(updateSessionTime, inactiveTimeLimit) {
    this.updateSessionTime = updateSessionTime || 5 * 60 * 1000;
    this.inactiveTimeLimit = inactiveTimeLimit || 30 * 60 * 1000;
    this.inactiveWorkspaceTimeLimit = Math.min(workspaceTimeoutInMinutes, 480) * 60 * 1000;
    this.mostRecentActivityTimestamp = Date.now();
    this.interval = null;
    this.popupShown = false;
    this.fetchUserAttemptCounter = 0;
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
  workspaceStart() {
    const iframeContent = document.getElementsByTagName('iframe');

    // check if workspace has iframe
    // check if listeners have already been added
    // if it has iframe add event listeners
    if (iframeContent
      && iframeContent.length > 0
      && iframeContent[0].contentDocument
      && !iframeContent[0].dataset.listenersBound) {
      // add marker to note that listeners have been set
      // added this way so it is cleared with the event listeners if user navigates away from page and comes back
      iframeContent[0].dataset.listenersBound = true;
      iframeContent[0].contentDocument.addEventListener('mousedown', () => this.updateUserActivity(), false);
      iframeContent[0].contentDocument.addEventListener('keypress', () => this.updateUserActivity(), false);
    }
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

  pageFromURL(currentURL) {
    const paths = currentURL.split('/').filter(x => x !== 'dev.html' && x !== '');
    return paths[paths.length - 1];
  }

  isUserOnPage(pageName) {
    return this.pageFromURL(window.location.href) === pageName;
  }

  updateSession() {
    if (this.isUserOnPage('login')) {
      return Promise.resolve(0);
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

    // If the user has been inactive for this.inactiveWorkspaceTimeLimit minutes
    // and they *are* in a workspace
    if (timeSinceLastActivity >= this.inactiveWorkspaceTimeLimit
        && this.isUserOnPage('workspace')
        && logoutInactiveUsers) {
      this.notifyUserIfTheyAreNotLoggedIn();
      return Promise.resolve(0);
    }

    // If on workspace start workspace specific event listeners
    if (this.isUserOnPage('workspace')) {
      this.workspaceStart();
    }

    return this.refreshSession();
  }

  refreshSession() {
    if (this.isUserOnPage('login')) {
      return Promise.resolve(0);
    }
    // hitting Fence endpoint refreshes token
    return getReduxStore().then((store) => {
      store.dispatch(fetchUser).then((response) => {
        this.fetchUserAttemptCounter = 0;
        if (response.type === 'UPDATE_POPUP') {
          this.popupShown = true;
        }
      }).catch(() => {
        this.fetchUserAttemptCounter += 1;
        // try again after 5 seconds only retry 9 times
        // stop after 9 times as this will be triggered again after updateSessionTime
        if (this.fetchUserAttemptCounter < 10) {
          setTimeout(() => this.refreshSession(), 5 * 1000);
        } else {
          this.notifyUserIfTheyAreNotLoggedIn();
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
        }
      });
    });
  }
}

const singleton = new SessionMonitor();
export default singleton;
