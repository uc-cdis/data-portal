import { connect } from 'react-redux';
import DataDictionaryTable from './DataDictionaryTable';

const setExpandNode = nodeID => ({
  type: 'TABLE_EXPAND_NODE_ID',
  nodeID,
});

export const ReduxDataDictionaryTable = (() => {
  const mapStateToProps = state => ({
    dictionary: state.submission.dictionary,
    highlightingNodeID: state.ddgraph.highlightingNode ? state.ddgraph.highlightingNode.id : null,
  });

  const mapDispatchToProps = dispatch => ({
    onExpandNode: nodeID =>
      dispatch(setExpandNode(nodeID)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(DataDictionaryTable);
})();
