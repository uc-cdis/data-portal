import { connect } from 'react-redux';
import ProjectSubmission from './ProjectSubmission';
import { getCounts } from './actions.thunk';

/** @param {{ submission: import('./types').SubmissionState }} state */
const mapStateToProps = (state) => ({
  typeList: state.submission.nodeTypes,
  dataIsReady: !!state.submission.counts_search,
  dictionary: state.submission.dictionary,
});

/** @param {import('redux-thunk').ThunkDispatch} dispatch */
const mapDispatchToProps = (dispatch) => ({
  onGetCounts: (project) => {
    dispatch(getCounts(project));
  },
});

const ReduxProjectSubmission = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectSubmission);

export default ReduxProjectSubmission;
