import { connect } from 'react-redux';
import ExplorerButtonGroup from '.';
import { resetJob, setJobStatusInterval } from '../../redux/kube/slice';
import { dispatchJob, checkJobStatus } from '../../redux/kube/asyncThunks';
import { requestErrored } from '../../redux/status/slice';
import { jobapiPath } from '../../localconf';
import { asyncSetInterval } from '../../utils';
import { fetchWithCreds } from '../../utils.fetch';

/** @param {import('../../redux/types').RootState} state */
const mapStateToProps = (state) => ({
  job: state.kube.job,
  user: state.user,
  userAccess: state.userAccess,
});

/** @param {import('../../redux/types').AppDispatch} dispatch */
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
