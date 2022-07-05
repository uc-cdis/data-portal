import { connect } from 'react-redux';
import Login from './Login';
import { components } from '../params';

/** @param {import('../redux/types').RootState} state */
const mapStateToProps = (state) => ({
  data: components.login,
  providers: state.login.providers,
  username: state.user.username,
});

const ReduxLogin = connect(mapStateToProps)(Login);
export default ReduxLogin;
