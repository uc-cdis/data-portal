import { fetchWithCreds } from '../actions';
import { wtsPath } from '../localconf';
import { getUrlForRedirectLocation } from '../Login/Login';

let lastRefreshMs = 0;
const debounceMs = 60000;

// start workspace session for WTS, call optional connectedCallBack if initialized/connected
/* eslint-disable import/prefer-default-export */
export const initWorkspaceRefreshToken = (redirectLocation, connectedCallBack) => {
  const redirectUrl = getUrlForRedirectLocation(redirectLocation);
  const nowMs = Date.now();
  if (nowMs - lastRefreshMs > debounceMs) {
    fetchWithCreds({
      path: `${wtsPath}connected`,
      method: 'GET',
    })
      .then(
        ({ status }) => {
          // if (status !== 200) {
            if ( 1===1 ) {
            window.location.href = `${wtsPath}/authorization_url?redirect=${redirectUrl}`;
          } else if (connectedCallBack) {
            connectedCallBack();
          }
        },
      );
    lastRefreshMs = Date.now();
  } else if (connectedCallBack) {
    // if still within debounce time, don't call WTS, directly do the callback if available
    connectedCallBack();
  }
};
