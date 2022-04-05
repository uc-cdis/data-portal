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
    function loadResources() {
      const { ddgraph, submission } = getState();
      const { graphvizLayout } = ddgraph;
      const { dictionary } = submission;
      const isLoaded = dictionary !== undefined && graphvizLayout !== undefined;
      return { dictionary, graphvizLayout, isLoaded };
    }

    /**
     * @param {SubmissionState['dictionary']} dictionary
     * @param {DdgraphState['graphvizLayout']} graphvizLayout
     * @param {number} interval
     */
    function init(dictionary, graphvizLayout, interval) {
      window.clearInterval(interval);
      const graphLayout = calculateGraphLayout(dictionary, graphvizLayout);
      dispatch(setGraphLayout(graphLayout));
      const legendItems = getAllTypes(graphLayout.nodes);
      dispatch(setGraphLegend(legendItems));
    }

    const interval = window.setInterval(() => {
      const { dictionary, graphvizLayout, isLoaded } = loadResources();
      if (isLoaded) init(dictionary, graphvizLayout, interval);
    }, 100);
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
