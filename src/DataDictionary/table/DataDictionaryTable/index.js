import { connect } from 'react-redux';
import localconf from '../../../localconf';
import { setExpandNode } from '../../action.js';
import DataDictionaryTable from './DataDictionaryTable';

const ReduxDataDictionaryTable = (() => {
  const mapStateToProps = state => ({
    dictionary: state.submission.dictionary,
    highlightingNodeID: state.ddgraph.highlightingNode
      ? state.ddgraph.highlightingNode.id : state.ddgraph.tableExpandNodeID,
    dictionaryName: localconf.appname,
  });

  const mapDispatchToProps = dispatch => ({
    onExpandNode: nodeID =>
      dispatch(setExpandNode(nodeID)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(DataDictionaryTable);
})();

export default ReduxDataDictionaryTable;
