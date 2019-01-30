import React from 'react';
import PropTypes from 'prop-types';
import GraphNode from '../GraphNode/GraphNode';
import GraphEdge from '../GraphEdge/GraphEdge';
import { SearchResultItemShape } from '../../utils';
import './GraphDrawer.css';

class GraphDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.graphDomRef = React.createRef();
    this.graphNodeRefs = [];
    this.nodeSVGElementInitialized = false;
  }

  componentDidUpdate() {
    // check if need update all node's svg elements
    // this only happens once, at the first time graph is rendered
    if (this.props.isGraphView
       && this.props.layoutInitialized
       && !this.nodeSVGElementInitialized) {
      const graphNodesSVGElements = this.props.nodes.map(node => ({
        nodeID: node.id,
        svgElement: this.getNodeRef(node.id).current.getSVGElement(),
      }))
        .reduce((acc, cur) => {
          acc[cur.nodeID] = cur.svgElement;
          return acc;
        }, {});
      this.nodeSVGElementInitialized = true;
      this.props.onGraphNodesSVGElementsUpdated(graphNodesSVGElements);
    }
  }

  onMouseOverNode = (node) => {
    this.props.onHoverNode(node.id);
  }

  onMouseOutNode = () => {
    this.props.onCancelHoverNode();
  }

  onClickNode = (node) => {
    this.props.onClickNode(node.id);
  }

  getNodeRef = (nodeID) => {
    if (!this.graphNodeRefs[nodeID]) {
      this.graphNodeRefs[nodeID] = React.createRef();
    }
    return this.graphNodeRefs[nodeID];
  }

  render() {
    if (!this.props.layoutInitialized) return (<React.Fragment />);
    const boundingBoxLength = this.props.graphBoundingBox[2][0];
    const fittingScale = Math.min(
      this.props.canvasWidth,
      this.props.canvasHeight,
    ) / boundingBoxLength;
    const fittingTransX = Math.abs(
      (boundingBoxLength - (this.props.canvasWidth / fittingScale)) / 2,
    );
    const fittingTransY = Math.abs(
      (boundingBoxLength - (this.props.canvasHeight / fittingScale)) / 2,
    );
    if (isNaN(fittingTransX) || isNaN(fittingTransY) || isNaN(fittingScale)) return <g />;
    return (
      <g
        className='graph-drawer'
        transform={`scale(${fittingScale}) translate(${fittingTransX}, ${fittingTransY}) `}
        ref={this.graphDomRef}
      >
        {
          this.props.edges.map((edge, i) => {
            let isEdgeFaded = false;
            let isEdgeHalfFaded = false;
            let isEdgeHighlighted = false;
            if (this.props.isSearchMode) {
              isEdgeFaded = true;
            } else if (this.props.highlightingNode) {
              const isEdgeRelatedToHighlightedNode =
                this.props.relatedNodeIDs.includes(edge.source)
                && this.props.relatedNodeIDs.includes(edge.target);
              if (this.props.secondHighlightingNodeID) {
                const isEdgeAlongPathRelatedToSecondHighlightNode =
                  !!this.props.pathRelatedToSecondHighlightingNode
                    .find(e => (e.source === edge.source && e.target === edge.target));
                isEdgeHalfFaded = isEdgeRelatedToHighlightedNode
                  && !isEdgeAlongPathRelatedToSecondHighlightNode;
                isEdgeFaded = !isEdgeRelatedToHighlightedNode;
                isEdgeHighlighted = isEdgeAlongPathRelatedToSecondHighlightNode;
              } else {
                isEdgeFaded = !isEdgeRelatedToHighlightedNode;
                isEdgeHighlighted = isEdgeRelatedToHighlightedNode;
              }
            }
            return (
              <GraphEdge
                key={`${edge.source}-${edge.target}-${i}`}
                edge={edge}
                isRequired={edge.required}
                isFaded={isEdgeFaded}
                isHalfFaded={isEdgeHalfFaded}
                isHighlighted={isEdgeHighlighted}
              />
            );
          })
        }
        {
          this.props.nodes.map((node) => {
            let isNodeFaded = false;
            let isNodeClickable = true;
            let isHighlightingNode = false;
            let isNodeHalfFaded = false;
            let isNodeDashed = false;
            if (this.props.isSearchMode) {
              isNodeFaded = !this.props.matchedNodeIDs.includes(node.id);
              isNodeDashed = this.props.matchedNodeIDsInNameAndDescription.length > 0
                && !isNodeFaded && !this.props.matchedNodeIDsInNameAndDescription.includes(node.id);
              isNodeClickable = !isNodeFaded;
            } else if (this.props.highlightingNode) {
              isHighlightingNode = (this.props.highlightingNode.id === node.id);
              isNodeClickable =
                this.props.highlightingNode.id === node.id
                || (this.props.secondHighlightingNodeCandidateIDs.length > 1
                  && this.props.secondHighlightingNodeCandidateIDs.includes(node.id));

              isNodeFaded = !this.props.relatedNodeIDs.includes(node.id);
              if (this.props.secondHighlightingNodeID) {
                isNodeHalfFaded = !isNodeFaded && !this.props.pathRelatedToSecondHighlightingNode
                  .find(e => (e.source === node.id || e.target === node.id));
              }
            }
            let matchedNodeNameIndices = [];
            this.props.searchResult.forEach((item) => {
              if (item.item.id === node.id) {
                item.matches.forEach((matchItem) => {
                  if (matchItem.key === 'title') {
                    matchedNodeNameIndices = matchItem.indices;
                  }
                });
              }
            });
            return (
              <GraphNode
                key={node.id}
                node={node}
                isHighlightingNode={isHighlightingNode}
                isFaded={isNodeFaded}
                isHalfFaded={isNodeHalfFaded}
                isDashed={isNodeDashed}
                isClickable={isNodeClickable}
                onMouseOver={() => this.onMouseOverNode(node)}
                onMouseOut={this.onMouseOutNode}
                onClick={() => this.onClickNode(node)}
                ref={this.getNodeRef(node.id)}
                matchedNodeNameIndices={matchedNodeNameIndices}
              />
            );
          })
        }
      </g>
    );
  }
}

GraphDrawer.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.object),
  edges: PropTypes.arrayOf(PropTypes.object),
  graphBoundingBox: PropTypes.array,
  layoutInitialized: PropTypes.bool,
  canvasWidth: PropTypes.number,
  canvasHeight: PropTypes.number,
  onHoverNode: PropTypes.func,
  onCancelHoverNode: PropTypes.func,
  onClickNode: PropTypes.func,
  highlightingNode: PropTypes.object,
  relatedNodeIDs: PropTypes.array,
  secondHighlightingNodeID: PropTypes.string,
  secondHighlightingNodeCandidateIDs: PropTypes.arrayOf(PropTypes.string),
  pathRelatedToSecondHighlightingNode: PropTypes.arrayOf(PropTypes.object),
  isGraphView: PropTypes.bool,
  isSearchMode: PropTypes.bool,
  matchedNodeIDs: PropTypes.arrayOf(PropTypes.string),
  matchedNodeIDsInNameAndDescription: PropTypes.arrayOf(PropTypes.string),
  onGraphNodesSVGElementsUpdated: PropTypes.func,
  searchResult: PropTypes.arrayOf(SearchResultItemShape),
};

GraphDrawer.defaultProps = {
  nodes: [],
  edges: [],
  graphBoundingBox: [[0, 0], [0, 1], [1, 1], [1, 0]],
  layoutInitialized: false,
  canvasWidth: 1000,
  canvasHeight: 1000,
  onHoverNode: () => {},
  onCancelHoverNode: () => {},
  onClickNode: () => {},
  highlightingNode: null,
  relatedNodeIDs: [],
  secondHighlightingNodeID: null,
  secondHighlightingNodeCandidateIDs: [],
  pathRelatedToSecondHighlightingNode: [],
  isGraphView: true,
  isSearchMode: false,
  matchedNodeIDs: [],
  matchedNodeIDsInNameAndDescription: [],
  onGraphNodesSVGElementsUpdated: () => {},
  searchResult: [],
};

export default GraphDrawer;
