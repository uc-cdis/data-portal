import { connect } from 'react-redux';
import WorkspaceRegistration from './WorkspaceRegistration';

const mapStateToProps = (state) => ({
  user: state.user,
  userAuthMapping: state.userAuthMapping,
});

export default connect(mapStateToProps)(WorkspaceRegistration);
