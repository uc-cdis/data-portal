import { connect } from 'react-redux';
import WorkspaceRegistration from './WorkspaceRegistration';

const mapStateToProps = (state) => ({
  userAuthMapping: state.userAuthMapping,
});

export default connect(mapStateToProps)(WorkspaceRegistration);
