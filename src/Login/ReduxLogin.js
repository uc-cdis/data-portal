import { connect } from 'react-redux';

import Login from './Login';
import { fetchWithCreds } from '../actions';
import { loginPath } from '../localconf';
import { components } from '../params';

/**
 * @param {any} data
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

/** @returns {(dispatch: import('redux-thunk').ThunkDispatch) => Promise} */
export const fetchLogin = () => (dispatch) =>
  fetchWithCreds({ path: loginPath, dispatch }).then(({ data, status }) => {
    dispatch(getLoginAction(data, status));
  });

const mapStateToProps = (state) => ({
  data: components.login,
  providers: state.login.providers,
});

const ReduxLogin = connect(mapStateToProps)(Login);
export default ReduxLogin;
