import { connect } from 'react-redux';

import Login from './Login';
import { fetchJsonOrText } from '../actions';
import { loginPath } from '../localconf';


export const fetchLogin = () =>
  dispatch =>
    fetchJsonOrText({
      path: loginPath,
      dispatch,
    })
      .then(
        ({ status, data }) => {
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
                  id: 'google',
                  name: 'Google OAuth',
                  url: `${loginPath}google/`,
                },
              ],
            };
          default:
            return {
              type: 'LOGIN_ENDPOINT_ERROR',
              error: data.error,
            };
          }
        },
      )
      .then(msg => dispatch(msg));


const mapStateToProps = state => ({
  providers: state.login.providers,
});

const mapDispatchToProps = () => ({
});

const ReduxLogin = connect(mapStateToProps, mapDispatchToProps)(Login);
export default ReduxLogin;
