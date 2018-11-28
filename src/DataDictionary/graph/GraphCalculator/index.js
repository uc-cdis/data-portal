import { connect } from 'react-redux';
import GraphCalculator from './GraphCalculator';
import {
  setGraphLayout,
  setGraphLegend,
  setRelatedNodeIDs,
  setSecondHighlightingNodeCandidateIDs,
  setPathRelatedToSecondHighlightingNode,
  setDataModelStructure,
} from '../../action.js';

const ReduxGraphCalculator = (() => {
  const mapStateToProps = state => ({
    dictionary: state.submission.dictionary,
    countsSearch: state.submission.counts_search,
    linksSearch: state.submission.links_search,
    highlightingNode: state.ddgraph.highlightingNode,
    nodes: state.ddgraph.nodes,
    edges: state.ddgraph.edges,
    secondHighlightingNodeID: state.ddgraph.secondHighlightingNodeID,
  });

  const mapDispatchToProps = dispatch => ({
    onGraphLayoutCalculated: layout => dispatch(setGraphLayout(layout)),
    onGraphLegendCalculated: legendItems => dispatch(setGraphLegend(legendItems)),
    onHighlightRelatedNodesCalculated: relatedNodeIDs =>
      dispatch(setRelatedNodeIDs(relatedNodeIDs)),
    onSecondHighlightingNodeCandidateIDsCalculated: secondHighlightingNodeCandidateIDs =>
      dispatch(setSecondHighlightingNodeCandidateIDs(secondHighlightingNodeCandidateIDs)),
    onPathRelatedToSecondHighlightingNodeCalculated: pathRelatedToSecondHighlightingNode =>
      dispatch(setPathRelatedToSecondHighlightingNode(pathRelatedToSecondHighlightingNode)),
    onDataModelStructureCalculated: dataModelStructure =>
      dispatch(setDataModelStructure(dataModelStructure)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(GraphCalculator);
})();

export default ReduxGraphCalculator;
