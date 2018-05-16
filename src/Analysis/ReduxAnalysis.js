import { connect } from 'react-redux';
import Analysis from './Analysis';
import { submitJob } from './AnalysisJob';

const mapStateToProps = state => ({
  job: state.analysis.job,
});

const mapDispatchToProps = dispatch => ({
  submitJob: did => dispatch(submitJob(did)),
});
const ReduxAnalysis = connect(mapStateToProps, mapDispatchToProps)(Analysis);
export default ReduxAnalysis;
