import { connect } from 'react-redux';
import DataModelGraph from './DataModelGraph';
import { createNodesAndEdges } from '../GraphUtils/utils';

/** @param {{ submission: import('../Submission/types').SubmissionState }} state */
const mapStateToProps = (state) => {
  const props = {
    dictionary: state.submission.dictionary,
    counts_search: state.submission.counts_search,
    links_search: state.submission.links_search,
  };
  return {
    full: createNodesAndEdges(props, true),
    compact: createNodesAndEdges(props, false),
  };
};

const ReduxDataModelGraph = connect(mapStateToProps)(DataModelGraph);
export default ReduxDataModelGraph;
