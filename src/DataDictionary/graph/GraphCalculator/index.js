import { connect } from 'react-redux';
import GraphCalculator from './GraphCalculator';
import {
  setGraphLayout,
  setGraphLegend,
  setRelatedNodeIDs,
  setSecondHighlightingNodeCandidateIDs,
  setPathRelatedToSecondHighlightingNode,
  setDataModelStructure,
} from '../../action';
import { calculateGraphLayout, getAllTypes } from './graphCalculatorHelper';

/** @typedef {import('../../types').DdgraphState} DdgraphState */
/** @typedef {import('../../types').GraphLayout} GraphLayout */
/** @typedef {import('../../../Submission/types').SubmissionState} SubmissionState */

function initializeLayout() {
  /**
   * @param {import('redux').Dispatch} dispatch
   * @param {() => { ddgraph: DdgraphState; submission: SubmissionState }} getState
   */
  return (dispatch, getState) => {
    const {
      submission: { dictionary },
      ddgraph: { graphvizLayout },
    } = getState();
    const graphLayout = calculateGraphLayout(dictionary, graphvizLayout);
    dispatch(setGraphLayout(graphLayout));
    const legendItems = getAllTypes(graphLayout.nodes);
    dispatch(setGraphLegend(legendItems));
  };
}

const ReduxGraphCalculator = (() => {
  /** @param {{ ddgraph: DdgraphState }} state */
  const mapStateToProps = (state) => ({
    highlightingNode: state.ddgraph.highlightingNode,
    nodes: state.ddgraph.nodes,
    edges: state.ddgraph.edges,
    secondHighlightingNodeID: state.ddgraph.secondHighlightingNodeID,
    layoutInitialized: state.ddgraph.layoutInitialized,
  });

  /** @param {import('redux-thunk').ThunkDispatch} dispatch */
  const mapDispatchToProps = (dispatch) => ({
    initializeLayout: () => dispatch(initializeLayout()),
    /** @param {DdgraphState['relatedNodeIDs']} relatedNodeIDs */
    onHighlightRelatedNodesCalculated: (relatedNodeIDs) =>
      dispatch(setRelatedNodeIDs(relatedNodeIDs)),
    /** @param {DdgraphState['secondHighlightingNodeCandidateIDs']} secondHighlightingNodeCandidateIDs */
    onSecondHighlightingNodeCandidateIDsCalculated: (
      secondHighlightingNodeCandidateIDs
    ) =>
      dispatch(
        setSecondHighlightingNodeCandidateIDs(
          secondHighlightingNodeCandidateIDs
        )
      ),
    /** @param {DdgraphState['pathRelatedToSecondHighlightingNode']} pathRelatedToSecondHighlightingNode */
    onPathRelatedToSecondHighlightingNodeCalculated: (
      pathRelatedToSecondHighlightingNode
    ) =>
      dispatch(
        setPathRelatedToSecondHighlightingNode(
          pathRelatedToSecondHighlightingNode
        )
      ),
    /**
     * @param {DdgraphState['dataModelStructure']} dataModelStructure
     * @param {DdgraphState['dataModelStructureRelatedNodeIDs']} dataModelStructureRelatedNodeIDs
     * @param {DdgraphState['routesBetweenStartEndNodes']} routesBetweenStartEndNodes
     */
    onDataModelStructureCalculated: (
      dataModelStructure,
      dataModelStructureRelatedNodeIDs,
      routesBetweenStartEndNodes
    ) =>
      dispatch(
        setDataModelStructure(
          dataModelStructure,
          dataModelStructureRelatedNodeIDs,
          routesBetweenStartEndNodes
        )
      ),
  });

  return connect(mapStateToProps, mapDispatchToProps)(GraphCalculator);
})();

export default ReduxGraphCalculator;
