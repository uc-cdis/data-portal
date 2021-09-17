import getReduxStore from '../reduxStore';
import { fetchWithCreds } from '../actions';
import { workspaceStatusUrl } from '../localconf';

export class WorkspaceSessionMonitor {
  constructor() {
    this.checkStatusInterval = 15 * 1000;
    this.workspaceShutdownAlertLimit = 5 * 60 * 1000; // Time limit for banner/popup begins to show
    this.interval = null;
  }

  start() {
    if (this.interval) { // interval already started
      return;
    }
    this.checkWorkspaceStatus();
    this.interval = setInterval(
      () => this.checkWorkspaceStatus(),
      this.checkStatusInterval,
    );
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null; // make sure the interval got cleared
    }
  }

  checkWorkspaceStatus() {
    fetchWithCreds({
      path: `${workspaceStatusUrl}`,
      method: 'GET',
    }).then(
      ({ data }) => {
        if (!data.idleTimeLimit || data.idleTimeLimit < 0) {
          this.stop();
          return;
        }
        if (data.idleTimeLimit > 0 && data.lastActivityTime > 0) {
          getReduxStore().then(
            (store) => {
              const remainingWorkspaceKernelLife = data.idleTimeLimit - (Date.now() - data.lastActivityTime);
              if (remainingWorkspaceKernelLife <= 0) { // kernel has died due to inactivity
                store.dispatch({ type: 'UPDATE_WORKSPACE_ALERT', data: { showShutdownBanner: false, showShutdownPopup: true, idleTimeLimit: data.idleTimeLimit } });
                this.stop();
              } else if (remainingWorkspaceKernelLife <= this.workspaceShutdownAlertLimit) {
                store.dispatch({ type: 'UPDATE_WORKSPACE_ALERT', data: { showShutdownBanner: true, showShutdownPopup: false, remainingWorkspaceKernelLife } });
              } else if (store.getState().popups.showShutdownBanner) {
                store.dispatch({ type: 'UPDATE_WORKSPACE_ALERT', data: { showShutdownBanner: false } });
              }
            },
          );
        }
      },
    );
  }
}

const singleton = new WorkspaceSessionMonitor();
export default singleton;
