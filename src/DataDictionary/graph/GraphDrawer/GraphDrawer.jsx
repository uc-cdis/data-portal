import React from 'react';
import PropTypes from 'prop-types';
import { getCategoryIconSVG } from '../../NodeCategories/helper';
import './GraphDrawer.css';

class GraphDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.currentHighlightingNodeClassName = 'graph-drawer__node--current-highlighting';
    this.graphDomRef = React.createRef();
  }

  componentDidUpdate() {
    if (this.props.isGraphView
      && this.props.highlightingNode
      && !this.props.highlightingNodeSVGElement) {
      const highlightingNodeSVGElement = this.getHighlightingNodeSVGElement();
      this.props.onHighlightingNodeSVGElementUpdated(highlightingNodeSVGElement);
    }
  }

  onMouseOver = (node, e) => {
    const hoveringNodeSVGElement = e.currentTarget;
    this.props.onHoverNode(node, hoveringNodeSVGElement);
  }

  onMouseOut = () => {
    this.props.onCancelHoverNode();
  }

  onClick = (node, e) => {
    if (!this.props.highlightingNode) { // if no node is highlighted yet
      const highlightingNodeSVGElement = e.currentTarget;
      this.props.onClickNode(node, highlightingNodeSVGElement);
    } else if (this.props.secondHighlightingNodeCandidateIDs.length > 1
      && this.props.secondHighlightingNodeCandidateIDs.includes(node.id)) {
      // only allow clicking clickable nodes
      // (only children of highlighted nodes are designed to be clickable)
      this.props.onClickNodeAsSecondHighlightingNode(node.id);
    }
  }

  getHighlightingNodeSVGElement() {
    const highlightingNodeSVGElement = document.querySelector(
      `.${this.currentHighlightingNodeClassName}`,
    );
    return highlightingNodeSVGElement;
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
    const clickableNodeClassName = 'graph-drawer__node--clickable';
    const notClickableNodeClassName = 'graph-drawer__node--not-clickable';
    const highlightedNodeClassName = 'graph-drawer__node--highlighted';
    const notHighlightedNodeClassName = 'graph-drawer__node--not-highlighted';
    const highlightedLinkClassName = 'graph-drawer__edge--highlighted';
    const notHighlightedLinkClassName = 'graph-drawer__edge--not-highlighted';
    const requiredLinkClassName = 'graph-drawer__edge--required';
    return (
      <g
        className='graph-drawer'
        transform={`scale(${fittingScale}) translate(${fittingTransX}, ${fittingTransY}) `}
        ref={this.graphDomRef}
      >
        { // edges
          this.props.edges.map((edge, i) => {
            let edgeRelatedClassModifier = '';
            if (this.props.highlightingNode) {
              // if clicked a futher node under highlighting mode
              if (this.props.secondHighlightingNodeID) {
                const isEdgeAlongPathRelatedToSecondHighlightNode =
                  this.props.pathRelatedToSecondHighlightingNode
                    .find(e => (e.source === edge.source && e.target === edge.target));
                if (isEdgeAlongPathRelatedToSecondHighlightNode) {
                  edgeRelatedClassModifier = highlightedLinkClassName;
                } else {
                  edgeRelatedClassModifier = notHighlightedLinkClassName;
                }
              } else {
                const isEdgeRelatedToHighlightedNode =
                  this.props.relatedNodeIDs.includes(edge.source)
                  && this.props.relatedNodeIDs.includes(edge.target);
                if (isEdgeRelatedToHighlightedNode) {
                  edgeRelatedClassModifier = highlightedLinkClassName;
                } else {
                  edgeRelatedClassModifier = notHighlightedLinkClassName;
                }
              }
            }
            const edgeRequiredClassModifier = edge.required ? requiredLinkClassName : '';
            return (
              <path
                key={`${edge.source}-${edge.target}-${i}`}
                className={`graph-drawer__edge ${edgeRequiredClassModifier} ${edgeRelatedClassModifier}`}
                d={edge.pathString}
              />
            );
          })
        }
        { // nodes
          this.props.nodes.map((node) => { // check required keys
            if (!(node.id !== undefined && node.type !== undefined
              && node.textPadding !== undefined && node.topCenterX !== undefined
              && node.topCenterY !== undefined && node.width !== undefined
              && node.height !== undefined && node.color !== undefined
              && node.names !== undefined && node.iconRadius !== undefined)
              && node.textLineGap !== undefined && node.fontSize !== undefined) {
              return null;
            }
            const IconSVG = getCategoryIconSVG(node.type);
            const textTopY = node.textPadding;
            let nodeHighlightedClassModifier = '';
            let nodeClickableClassModifier = '';
            let nodeIsCurrentHighlightingClassModifier = '';
            if (this.props.highlightingNode) {
              nodeClickableClassModifier =
                this.props.secondHighlightingNodeCandidateIDs.includes(node.id)
                  ? clickableNodeClassName : notClickableNodeClassName;
              if (this.props.secondHighlightingNodeID) {
                nodeHighlightedClassModifier = this.props.pathRelatedToSecondHighlightingNode
                  .find(e => (e.source === node.id || e.target === node.id))
                  ? highlightedNodeClassName : notHighlightedNodeClassName;
              } else {
                nodeHighlightedClassModifier = this.props.relatedNodeIDs.includes(node.id)
                  ? highlightedNodeClassName : notHighlightedNodeClassName;
              }
              if (this.props.highlightingNode.id === node.id) {
                nodeIsCurrentHighlightingClassModifier = this.currentHighlightingNodeClassName;
              }
            } else {
              nodeClickableClassModifier = clickableNodeClassName;
            }
            return (
              <g
                key={node.id}
                transform={`translate(${node.topCenterX}, ${node.topCenterY}) `}
                className={`graph-drawer__node 
                  ${nodeHighlightedClassModifier} 
                  ${nodeClickableClassModifier}
                  ${nodeIsCurrentHighlightingClassModifier}`}
                onMouseOver={e => this.onMouseOver(node, e)}
                onMouseOut={this.onMouseOut}
                onClick={e => this.onClick(node, e)}
                id={node.id}
              >
                <rect
                  className='graph-drawer__node-rect'
                  x={-node.width / 2}
                  y={0}
                  width={node.width}
                  height={node.height}
                  rx={4}
                  ry={4}
                  stroke={node.color}
                />
                {
                  node.names.map((row, i) => (
                    <text
                      key={`${node.id}-${i}`}
                      className='graph-drawer__text'
                      x={0}
                      y={textTopY + (i * (node.fontSize + node.textLineGap))}
                      textAnchor='middle'
                      alignmentBaseline='hanging'
                      fontSize={node.fontSize}
                    >
                      {row}
                    </text>
                  ))
                }
                {
                  <g
                    transform={`translate(${-node.iconRadius}, ${-node.iconRadius})`}
                  >
                    {
                      IconSVG ? <IconSVG /> : (
                        <circle
                          cx={node.iconRadius}
                          cy={node.iconRadius}
                          r={node.iconRadius}
                          fill={node.color}
                        />
                      )
                    }
                  </g>
                }
              </g>
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
  onClickNodeAsSecondHighlightingNode: PropTypes.func,
  secondHighlightingNodeID: PropTypes.string,
  secondHighlightingNodeCandidateIDs: PropTypes.arrayOf(PropTypes.string),
  pathRelatedToSecondHighlightingNode: PropTypes.arrayOf(PropTypes.object),
  highlightingNodeSVGElement: PropTypes.object,
  onHighlightingNodeSVGElementUpdated: PropTypes.func,
  isGraphView: PropTypes.bool,
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
  onClickNodeAsSecondHighlightingNode: () => {},
  secondHighlightingNodeID: null,
  secondHighlightingNodeCandidateIDs: [],
  pathRelatedToSecondHighlightingNode: [],
  highlightingNodeSVGElement: null,
  onHighlightingNodeSVGElementUpdated: () => {},
  isGraphView: true,
};


export default GraphDrawer;
