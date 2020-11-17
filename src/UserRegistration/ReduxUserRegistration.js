import { connect } from 'react-redux';
import UserRegistration from './UserRegistration';

const mapStateToProps = (state) => ({
  shouldRegister: Object.keys(state.user.authz).length === 0,
});

export default connect(mapStateToProps)(UserRegistration);
