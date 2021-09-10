import { connect } from 'react-redux';
import ProjectSubmission from './ProjectSubmission';
import { getCounts } from '../DataModelGraph/ReduxDataModelGraph';

const mapStateToProps = (state) => ({
  typeList: state.submission.nodeTypes,
  dataIsReady: !!state.submission.counts_search,
  dictionary: state.submission.dictionary,
});

const mapDispatchToProps = (dispatch) => ({
  onGetCounts: (typeList, project, dictionary) =>
    dispatch(getCounts(typeList, project, dictionary)),
});

const ReduxProjectSubmission = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectSubmission);

export default ReduxProjectSubmission;
