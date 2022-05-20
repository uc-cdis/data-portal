import getReduxStore from '../reduxStore';

const EVENT_TYPE = "message"; // from event types https://developer.mozilla.org/en-US/docs/Web/API/EventSource/message_event

export class AtlasSessionMonitor {

  constructor() {
    this.checkStatusInterval = 15 * 1000;
    this.atlasShutdownAlertLimit = 5 * 60 * 1000; // Time limit for banner/popup begins to show
    this.interval = null;
  }

  start() {
    if (this.interval) { // interval already started
      return;
    }
    window.addEventListener(EVENT_TYPE, () => this.updateUserActivity(), false); // receives mouseovers from atlas
    this.checkAtlasStatus();
    this.interval = setInterval(
      () => this.checkCheckStatus(),
      this.checkStatusInterval,
    );
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      window.removeEventListener(EVENT_TYPE, () => this.updateUserActivity(), false);
      this.interval = null; // make sure the interval got cleared
    }
  }

  // logoutUser() {
  //   // don't hit the logout endpoint over and over if the popup is already shown
  //   if (this.popupShown) {
  //     return;
  //   }

  //   getReduxStore().then((store) => {
  //     store.dispatch(logoutAPI(true));
  //     this.popupShown = true;
  //   });
  // }

  updateUserActivity() {
    this.mostRecentActivityTimestamp = Date.now();
  }

  // checkAtlasStatus() {
  //   if (idleLimit < 0) {
  //       this.stop()
  //   }
  //   if (idleLimit > 0 && lastActivityTime > 0) {
  //       getReduxStore().then(
  //           (store) => {
  //               const remainingSessionTime = idleLimit  - (Date.now() - lastActivityTime);
  //             if (remainingSessionTime <= 0) { // kernel has died due to inactivity
  //               store.dispatch({ type: 'UPDATE_ATLAS_ALERT', data: { showShutdownBanner: false, showShutdownPopup: true, idleTimeLimit: idleTimeLimit } });
  //               this.stop();
  //             } else if (remainingSessionTime <= this.workspaceShutdownAlertLimit) {
  //               store.dispatch({ type: 'UPDATE_ATLAS_ALERT', data: { showShutdownBanner: true, showShutdownPopup: false, remainingWorkspaceKernelLife } });
  //             } else if (store.getState().popups.showShutdownBanner) {
  //               store.dispatch({ type: 'UPDATE_ATLAS_ALERT', data: { showShutdownBanner: false } });
  //             }
  //           },
  //         );
  //       }
  //   }
}

const singleton = new AtlasSessionMonitor();
export default singleton;
