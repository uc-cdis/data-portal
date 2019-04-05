import { connect } from 'react-redux';
import AnalysisApp from './AnalysisApp';
import { submitJob } from './AnalysisJob';

const mapStateToProps = state => ({
  job: state.analysis.job,
});

const mapDispatchToProps = dispatch => ({
  submitJob: did => dispatch(submitJob(did)),
});
const ReduxAnalysisApp = connect(mapStateToProps, mapDispatchToProps)(AnalysisApp);
export default ReduxAnalysisApp;
