import { connect } from 'react-redux';
import { appname } from '../../../localconf';
import { setExpandNode } from '../../action';
import DataDictionaryTable from './DataDictionaryTable';

const ReduxDataDictionaryTable = (() => {
  const mapStateToProps = state => ({
    dictionary: state.submission.dictionary,
    highlightingNodeID: state.ddgraph.tableExpandNodeID,
    dictionaryName: appname,
  });

  const mapDispatchToProps = dispatch => ({
    onExpandNode: nodeID =>
      dispatch(setExpandNode(nodeID)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(DataDictionaryTable);
})();

export default ReduxDataDictionaryTable;
