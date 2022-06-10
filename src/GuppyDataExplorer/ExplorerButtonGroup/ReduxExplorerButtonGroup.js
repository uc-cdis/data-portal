import { connect } from 'react-redux';
import ExplorerButtonGroup from '.';
import {
  dispatchJob,
  checkJob,
  fetchJobResult,
  resetJobState,
} from '../../actions.thunk';

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
    dispatch(checkJob());
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
