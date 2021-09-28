import { connect } from 'react-redux';
import { appname } from '../../../localconf';
import { setExpandNode } from '../../action';
import { parseDictionaryNodes } from '../../utils';
import DataDictionaryTable from './DataDictionaryTable';

const mapStateToProps = (state) => ({
  dictionaryName: appname,
  dictionaryNodes: parseDictionaryNodes(state.submission.dictionary),
  highlightingNodeID: state.ddgraph.tableExpandNodeID,
});

const mapDispatchToProps = (dispatch) => ({
  onExpandNode: (nodeID) => dispatch(setExpandNode(nodeID)),
});

const ReduxDataDictionaryTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(DataDictionaryTable);

export default ReduxDataDictionaryTable;
