import { connect } from 'react-redux';
import { getCounts } from './actions';
import DataModelGraph from './DataModelGraph';

const mapStateToProps = state => ({
  dictionary: state.submission.dictionary,
  counts_search: state.submission.counts_search,
  links_search: state.submission.links_search,
});

const mapDispatchToProps = dispatch => ({
  onGetCounts: (type, project) => dispatch(getCounts(type, project)),
});
const ReduxDataModelGraph = connect(mapStateToProps, mapDispatchToProps)(DataModelGraph);
export default ReduxDataModelGraph;
