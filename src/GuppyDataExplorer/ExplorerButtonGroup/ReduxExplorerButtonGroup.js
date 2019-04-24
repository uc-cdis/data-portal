import { connect } from 'react-redux';
import ExplorerButtonGroup from '../ExplorerButtonGroup';
import { dispatchJob, checkJob, fetchJobResult, resetJobState } from '../../Analysis/AnalysisJob';

const mapStateToProps = state => ({
  job: state.analysis.job,
});

const mapDispatchToProps = dispatch => ({
  submitJob: body => dispatch(dispatchJob(body)),
  checkJobStatus: () => dispatch(checkJob()),
  fetchJobResult: jobId => dispatch(fetchJobResult(jobId)),
  resetJobState: () => dispatch(resetJobState()),
});
const ReduxExplorerButtonGroup = connect(mapStateToProps, mapDispatchToProps)(ExplorerButtonGroup);
export default ReduxExplorerButtonGroup;
