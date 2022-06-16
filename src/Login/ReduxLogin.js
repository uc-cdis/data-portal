import { connect } from 'react-redux';
import Login from './Login';
import { components } from '../params';

/** @typedef {import('./types').LoginState} LoginState */

/** @param {{ login: LoginState; user: import('../types').UserState }} state */
const mapStateToProps = (state) => ({
  data: components.login,
  providers: state.login.providers,
  username: state.user.username,
});

const ReduxLogin = connect(mapStateToProps)(Login);
export default ReduxLogin;
