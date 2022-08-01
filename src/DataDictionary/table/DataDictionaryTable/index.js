import { connect } from 'react-redux';
import { appname } from '../../../localconf';
import { setExpandNode } from '../../../redux/ddgraph/slice';
import { parseDictionaryNodes } from '../../utils';
import DataDictionaryTable from './DataDictionaryTable';

/** @param {import('../../../redux/types').RootState} state */
const mapStateToProps = (state) => ({
  dictionaryName: appname,
  dictionaryNodes: parseDictionaryNodes(state.submission.dictionary),
  highlightingNodeID: state.ddgraph.tableExpandNodeID,
});

/** @param {import('../../../redux/types').AppDispatch} dispatch */
const mapDispatchToProps = (dispatch) => ({
  /** @param {string} nodeId */
  onExpandNode: (nodeId) => {
    dispatch(setExpandNode(nodeId));
  },
});

const ReduxDataDictionaryTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(DataDictionaryTable);

export default ReduxDataDictionaryTable;
