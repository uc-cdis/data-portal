import { connect } from 'react-redux';
import ExplorerButtonGroup from '.';
import {
  dispatchJob, checkJob, fetchJobResult, resetJobState,
} from '../../Analysis/AnalysisJob';

const mapStateToProps = (state) => ({
  job: state.analysis.job,
  userAccess: state.userAccess.access,
  selectingMode: state.tickbox.selectingMode,
  filteredItems: state.tickbox.filteredItems,
  allSelected: state.tickbox.allSelected
});

const mapDispatchToProps = (dispatch) => ({
  submitJob: (body) => dispatch(dispatchJob(body)),
  checkJobStatus: () => dispatch(checkJob()),
  fetchJobResult: (jobId) => dispatch(fetchJobResult(jobId)),
  resetJobState: () => dispatch(resetJobState()),
});
const ReduxExplorerButtonGroup = connect(mapStateToProps, mapDispatchToProps)(ExplorerButtonGroup);
export default ReduxExplorerButtonGroup;
