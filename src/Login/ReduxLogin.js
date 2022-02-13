import { connect } from 'react-redux';

import Login from './Login';
import { fetchWithCreds } from '../actions';
import { loginPath } from '../localconf';
import { components } from '../params';

/** @typedef {import('./types').LoginProvider} LoginProvider */
/** @typedef {import('./types').LoginState} LoginState */

/**
 * @param {{ providers: LoginProvider[]; error: any }} data
 * @param {number} status
 * @returns {import('redux').AnyAction}
 */
function getLoginAction(data, status) {
  switch (status) {
    case 200:
      return {
        type: 'RECEIVE_LOGIN_ENDPOINT',
        providers: data.providers,
      };
    case 404:
      return {
        type: 'RECEIVE_LOGIN_ENDPOINT',
        providers: [
          {
            idp: 'google',
            name: 'Google OAuth',
            urls: [
              {
                name: 'Google OAuth',
                url: `${loginPath}google/`,
              },
            ],
          },
        ],
      };
    default:
      return {
        type: 'LOGIN_ENDPOINT_ERROR',
        error: data.error,
      };
  }
}

export const fetchLogin =
  () => (/** @type {import('redux').Dispatch} */ dispatch) =>
    fetchWithCreds({ path: loginPath, dispatch }).then(({ data, status }) => {
      dispatch(getLoginAction(data, status));
    });

/** @param {{ login: LoginState; user: import('../types').UserState }} state */
const mapStateToProps = (state) => ({
  data: components.login,
  providers: state.login.providers,
  username: state.user.username,
});

const ReduxLogin = connect(mapStateToProps)(Login);
export default ReduxLogin;
