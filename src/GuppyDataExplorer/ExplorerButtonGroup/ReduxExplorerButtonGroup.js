import { connect } from 'react-redux';
import ExplorerButtonGroup from '.';
import { requestErrored, resetJob, setJobStatusInterval } from '../../actions';
import { dispatchJob, checkJobStatus } from '../../actions.thunk';
import { jobapiPath } from '../../localconf';
import { asyncSetInterval } from '../../utils';
import { fetchWithCreds } from '../../utils.fetch';

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
  fetchJobResult: (jobId) =>
    fetchWithCreds({
      path: `${jobapiPath}output?UID=${jobId}`,
      method: 'GET',
      onError: () => dispatch(requestErrored()),
    }),
  resetJobState: () => {
    dispatch(resetJob());
  },
});
const ReduxExplorerButtonGroup = connect(
  mapStateToProps,
  mapDispatchToProps
)(ExplorerButtonGroup);
export default ReduxExplorerButtonGroup;
