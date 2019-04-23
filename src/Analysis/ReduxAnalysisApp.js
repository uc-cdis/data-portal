import { connect } from 'react-redux';
import AnalysisApp from './AnalysisApp';
import { dispatchJob, checkJob, fetchJobResult, resetJobState } from './AnalysisJob';

const mapStateToProps = state => ({
  job: state.analysis.job,
});

const mapDispatchToProps = dispatch => ({
  submitJob: body => dispatch(dispatchJob(body)),
  checkJobStatus: () => dispatch(checkJob()),
  fetchJobResult: jobId => dispatch(fetchJobResult(jobId)),
  resetJobState: () => dispatch(resetJobState()),
});
const ReduxAnalysisApp = connect(mapStateToProps, mapDispatchToProps)(AnalysisApp);
export default ReduxAnalysisApp;
