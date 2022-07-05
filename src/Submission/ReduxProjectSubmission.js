import { connect } from 'react-redux';
import ProjectSubmission from './ProjectSubmission';
import { fetchCounts } from '../redux/submission/asyncThunks';

/** @param {import('../redux/types').RootState} state */
const mapStateToProps = (state) => ({
  typeList: state.submission.nodeTypes,
  dataIsReady: !!state.submission.counts_search,
  dictionary: state.submission.dictionary,
});

/** @param {import('../redux/types').AppDispatch} dispatch */
const mapDispatchToProps = (dispatch) => ({
  onGetCounts: (project) => {
    dispatch(fetchCounts(project));
  },
});

const ReduxProjectSubmission = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectSubmission);

export default ReduxProjectSubmission;
