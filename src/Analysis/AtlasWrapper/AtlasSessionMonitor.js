import getReduxStore from '../reduxStore';

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
    this.checkAtlasStatus();
    this.interval = setInterval(
      () => this.checkCheckStatus(),
      this.checkStatusInterval,
    );
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null; // make sure the interval got cleared
    }
  }

  checkAtlasStatus() {
    if (idleLimit < 0) {
        this.stop()
    }
    if (idleLimit > 0 && lastActivityTime > 0) {
        getReduxStore().then(
            (store) => {
                const remainingSessionTime = idleLimit  - (Date.now() - lastActivityTime);
              if (remainingSessionTime <= 0) { // kernel has died due to inactivity
                store.dispatch({ type: 'UPDATE_ATLAS_ALERT', data: { showShutdownBanner: false, showShutdownPopup: true, idleTimeLimit: idleTimeLimit } });
                this.stop();
              } else if (remainingSessionTime <= this.workspaceShutdownAlertLimit) {
                store.dispatch({ type: 'UPDATE_ATLAS_ALERT', data: { showShutdownBanner: true, showShutdownPopup: false, remainingWorkspaceKernelLife } });
              } else if (store.getState().popups.showShutdownBanner) {
                store.dispatch({ type: 'UPDATE_ATLAS_ALERT', data: { showShutdownBanner: false } });
              }
            },
          );
        }
    }
}

const singleton = new AtlasSessionMonitor();
export default singleton;
