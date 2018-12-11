import { connect } from 'react-redux';
import {
  setMatchedNodeExpandingStatus,
} from '../../action';
import SearchResultLayer from './SearchResultLayer';

const ReduxSearchResultLayer = (() => {
  const mapStateToProps = state => ({
    graphNodesSVGElements: state.ddgraph.graphNodesSVGElements,
    matchedNodeIDs: state.ddgraph.matchedNodeIDs,
    dictionary: state.submission.dictionary,
    matchedNodeExpandingStatus: state.ddgraph.matchedNodeExpandingStatus,
    searchResult: state.ddgraph.searchResult,
    canvasBoundingRect: state.ddgraph.canvasBoundingRect,
  });

  const mapDispatchToProps = dispatch => ({
    onClosePopup: nodeID =>
      dispatch(setMatchedNodeExpandingStatus(nodeID, false)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(SearchResultLayer);
})();

export default ReduxSearchResultLayer;
