import { userapiPath } from '../localconf';
import getReduxStore from '../reduxStore';
import { logoutAPI } from '../actions';
import { fetchUser } from '../actions';

/* eslint-disable class-methods-use-this */
export class SessionMonitor {
  constructor(updateSessionTime, inactiveTimeLimit) {
    console.log('constructing session monitor');
    this.updateSessionTime = updateSessionTime || 5 * 60 * 1000;
    this.inactiveTimeLimit = inactiveTimeLimit || 60 * 60 * 1000;
    this.mostRecentActivityTimestamp = Date.now();
    this.mostRecentLogoutTime = Date.now();
    this.allowedTimeBetweenLogoutCalls =  1 * 60 * 1000;
    this.interval = null;
    this.numRefreshedCounter = 0;
  }

  start() {
    return; 

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

  updateSession() {
    return Promise.resolve(0);
    console.log('updateSession was called');
    // If user has been inactive for Y min
    if (Date.now() - this.mostRecentActivityTimestamp >= this.inactiveTimeLimit) {
      console.log('SessionMonitor just logged u out ');
      this.logoutUser();
      return Promise.resolve(0);
    } else if (Date.now() - this.mostRecentActivityTimestamp < this.inactiveTimeLimit) {
      return this.refreshSession();
    } else {
      console.log('Error calculating inactive time');
      return Promise.resolve(0);
    }
  }

  refreshSession() {
    // hitting Fence endpoint refreshes token
    console.log('refreshSession was called');

    // getReduxStore().then(
    //   store => {
    //     return store.dispatch(fetchUser) // make an API call to see if we're still logged in ...
    //         .then(
    //           () => {
    //             const { user } = store.getState();
    //             //newState.user = user;
    //             if (!user.username) { // not authenticated
    //             //  newState.redirectTo = '/login';
    //             //  newState.authenticated = false;
    //             } else { // auth ok - cache it
    //             //  lastAuthMs = Date.now();
    //             }
    //             //return newState;
    //           }
    //         );
    //   });

    // return fetch(userapiPath);
    var _this = this;
    return fetch(`${userapiPath}user/`).then(function(response, data) {
      console.log('sessoion monitor got the result: ', response);
      if ((response.status == 401 || response.status == 403) 
        && Date.now() - _this.mostRecentLogoutTime > _this.allowedTimeBetweenLogoutCalls) {
        //console.log('logging out user');
        //_this.logoutUser();
      }
      _this.numRefreshedCounter += 1;
      console.log('_this.numRefreshedCounter: ', _this.numRefreshedCounter);
      return response;
    });
  }

  logoutUser() {
    getReduxStore().then((store) => {
      store.dispatch(logoutAPI());
    });
  }
}

const singleton = new SessionMonitor();
export default singleton;
