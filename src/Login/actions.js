/** @typedef {import('./types').LoginState} LoginState */

/**
 * @param {LoginState['providers']} payload
 * @returns {import('redux').AnyAction}
 */
export function receiveLoginEndpoint(payload) {
  return {
    type: 'RECEIVE_LOGIN_ENDPOINT',
    payload,
  };
}

/**
 * @param {LoginState['error']} payload
 * @returns {import('redux').AnyAction}
 */
export function loginEndpointErrored(payload) {
  return {
    type: 'LOGIN_ENDPOINT_ERROR',
    payload,
  };
}
