import { connect } from 'react-redux';

import Login from './Login';
import { fetchWithCreds } from '../actions';
import { loginPath } from '../localconf';
import dictIcons from '../img/icons/sliding';
import { components } from '../params';


export const fetchLogin = () =>
  dispatch =>
    fetchWithCreds({
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
                  idp: 'google',
                  name: 'Google OAuth',
                  urls: [{
                    name: 'Google OAuth',
                    url: `${loginPath}google/`,
                  }],
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
  dictIcons,
  data: components.login,
});

const mapDispatchToProps = () => ({
});

const ReduxLogin = connect(mapStateToProps, mapDispatchToProps)(Login);
export default ReduxLogin;
