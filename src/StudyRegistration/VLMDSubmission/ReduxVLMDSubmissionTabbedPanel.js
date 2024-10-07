import { connect } from 'react-redux';
import VLMDSubmissionTabbedPanel from './VLMDSubmissionTabbedPanel';

const mapStateToProps = (state) => ({
  user: state.user,
  userAuthMapping: state.userAuthMapping,
});

const ReduxVLMDSubmissionTabbedPanel = connect(mapStateToProps)(VLMDSubmissionTabbedPanel);
export default ReduxVLMDSubmissionTabbedPanel;
