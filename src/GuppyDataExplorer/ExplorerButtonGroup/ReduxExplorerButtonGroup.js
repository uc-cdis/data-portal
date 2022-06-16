import { connect } from 'react-redux';
import ExplorerButtonGroup from '.';
import { setJobStatusInterval } from '../../actions';
import {
  dispatchJob,
  fetchJobResult,
  resetJobState,
  checkJobStatus,
} from '../../actions.thunk';
import { asyncSetInterval } from '../../utils';

/** @typedef {import('../../types').KubeState} KubeState */
/** @typedef {import('../../types').UserAccessState} UserAccessState */

/** @param {{ kube: KubeState; userAccess: UserAccessState }} state */
const mapStateToProps = (state) => ({
  job: state.kube.job,
  userAccess: state.userAccess.access,
});

/** @param {import('redux-thunk').ThunkDispatch} dispatch */
const mapDispatchToProps = (dispatch) => ({
  submitJob: (body) => {
    dispatch(dispatchJob(body));
  },
  checkJobStatus: () => {
    const interval = asyncSetInterval(() => dispatch(checkJobStatus()), 1000);
    dispatch(setJobStatusInterval(interval));
  },
  /** @param {string} jobId */
  fetchJobResult: (jobId) => dispatch(fetchJobResult(jobId)),
  resetJobState: () => {
    dispatch(resetJobState());
  },
});
const ReduxExplorerButtonGroup = connect(
  mapStateToProps,
  mapDispatchToProps
)(ExplorerButtonGroup);
export default ReduxExplorerButtonGroup;
