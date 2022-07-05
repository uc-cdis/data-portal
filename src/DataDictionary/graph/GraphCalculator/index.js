import { connect } from 'react-redux';
import GraphCalculator from './GraphCalculator';
import {
  setGraphLayout,
  setGraphLegend,
  setRelatedNodeIDs,
  setSecondHighlightingNodeCandidateIDs,
  setPathRelatedToSecondHighlightingNode,
  setDataModelStructure,
} from '../../../redux/ddgraph/slice';
import { calculateGraphLayout, getAllTypes } from './graphCalculatorHelper';

/** @typedef {import('../../../redux/types').AppDispatch} AppDispatch */
/** @typedef {import('../../../redux/types').AppGetState} AppGetState */
/** @typedef {import('../../../redux/types').RootState} RootState */

function initializeLayout() {
  /**
   * @param {AppDispatch} dispatch
   * @param {AppGetState} getState
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
     * @param {RootState['submission']['dictionary']} dictionary
     * @param {RootState['ddgraph']['graphvizLayout']} graphvizLayout
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
  /** @param {RootState} state */
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
    /** @param {RootState['ddgraph']['relatedNodeIDs']} relatedNodeIDs */
    onHighlightRelatedNodesCalculated: (relatedNodeIDs) =>
      dispatch(setRelatedNodeIDs(relatedNodeIDs)),
    /** @param {RootState['ddgraph']['secondHighlightingNodeCandidateIDs']} secondHighlightingNodeCandidateIDs */
    onSecondHighlightingNodeCandidateIDsCalculated: (
      secondHighlightingNodeCandidateIDs
    ) =>
      dispatch(
        setSecondHighlightingNodeCandidateIDs(
          secondHighlightingNodeCandidateIDs
        )
      ),
    /** @param {RootState['ddgraph']['pathRelatedToSecondHighlightingNode']} pathRelatedToSecondHighlightingNode */
    onPathRelatedToSecondHighlightingNodeCalculated: (
      pathRelatedToSecondHighlightingNode
    ) =>
      dispatch(
        setPathRelatedToSecondHighlightingNode(
          pathRelatedToSecondHighlightingNode
        )
      ),
    /**
     * @param {RootState['ddgraph']['dataModelStructure']} dataModelStructure
     * @param {RootState['ddgraph']['dataModelStructureRelatedNodeIDs']} dataModelStructureRelatedNodeIDs
     * @param {RootState['ddgraph']['routesBetweenStartEndNodes']} routesBetweenStartEndNodes
     */
    onDataModelStructureCalculated: (
      dataModelStructure,
      dataModelStructureRelatedNodeIDs,
      routesBetweenStartEndNodes
    ) =>
      dispatch(
        setDataModelStructure({
          dataModelStructure,
          dataModelStructureRelatedNodeIDs,
          routesBetweenStartEndNodes,
        })
      ),
  });

  return connect(mapStateToProps, mapDispatchToProps)(GraphCalculator);
})();

export default ReduxGraphCalculator;
