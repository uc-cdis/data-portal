import { connect } from 'react-redux';
import { appname } from '../../../localconf';
import { setExpandNode } from '../../action';
import { parseDictionaryNodes } from '../../utils';
import DataDictionaryTable from './DataDictionaryTable';

/** @typedef {import('../../types').DdgraphState} DdgraphState */
/** @typedef {import('../../types').GraphNode} GraphNode */
/** @typedef {import('../../../Submission/types').SubmissionState} SubmissionState */

/** @param {{ ddgraph: DdgraphState; submission: SubmissionState }} state */
const mapStateToProps = (state) => ({
  dictionaryName: appname,
  dictionaryNodes: parseDictionaryNodes(state.submission.dictionary),
  highlightingNodeID: state.ddgraph.tableExpandNodeID,
});

/** @param {import('redux').Dispatch} dispatch */
const mapDispatchToProps = (dispatch) => ({
  /** @param {GraphNode['id']} nodeId */
  onExpandNode: (nodeId) => {
    dispatch(setExpandNode(nodeId));
  },
});

const ReduxDataDictionaryTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(DataDictionaryTable);

export default ReduxDataDictionaryTable;
