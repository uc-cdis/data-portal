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

/** @typedef {import('../../types').DdgraphState} DdgraphState */
/** @typedef {import('../../types').GraphLayout} GraphLayout */
/** @typedef {import('../../../Submission/types').SubmissionState} SubmissionState */

const ReduxGraphCalculator = (() => {
  /** @param {{ ddgraph: DdgraphState; submission: SubmissionState }} state */
  const mapStateToProps = (state) => ({
    dictionary: state.submission.dictionary,
    graphvizLayout: state.ddgraph.graphvizLayout,
    highlightingNode: state.ddgraph.highlightingNode,
    nodes: state.ddgraph.nodes,
    edges: state.ddgraph.edges,
    secondHighlightingNodeID: state.ddgraph.secondHighlightingNodeID,
    layoutInitialized: state.ddgraph.layoutInitialized,
  });

  /** @param {import('redux').Dispatch} dispatch */
  const mapDispatchToProps = (dispatch) => ({
    /** @param {GraphLayout} layout */
    onGraphLayoutCalculated: (layout) => dispatch(setGraphLayout(layout)),
    /** @param {DdgraphState['legendItems']} legendItems */
    onGraphLegendCalculated: (legendItems) =>
      dispatch(setGraphLegend(legendItems)),
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
