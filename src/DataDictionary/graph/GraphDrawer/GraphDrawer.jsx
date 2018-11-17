import React from 'react';
import PropTypes from 'prop-types';
import { getTypeIconSVG } from '../../utils';
import './GraphDrawer.css';

class GraphDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.currentHighlightingNodeClassName = 'graph-drawer__node--current-highlighting';
    this.graphDomRef = React.createRef();
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
    } else if (this.props.furtherClickableNodeIDs.length > 1
      && this.props.furtherClickableNodeIDs.includes(node.id)) {
      // only allow clicking clickable nodes
      // (only children of highlighted nodes are designed to be clickable)
      this.props.onFurtherClickNode(node.id);
    }
  }

  getHighlightingNodeSVGElement() {
    // const highlightingNodeSVGElement = this.graphDomRef.current.getElementsByClassName(this.currentHighlightingNodeClassName);

    const highlightingNodeSVGElement = document.querySelector(`.${this.currentHighlightingNodeClassName}`);
    return highlightingNodeSVGElement;
  }

  componentDidUpdate() {
    if (this.props.isGraphView && this.props.highlightingNode && !this.props.highlightingNodeSVGElement) {
      const highlightingNodeSVGElement = this.getHighlightingNodeSVGElement();
      this.props.onHighlightingNodeSVGElementUpdated(highlightingNodeSVGElement);
    }
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
    const highlightedLinkClassName = 'graph-drawer__link--highlighted';
    const notHighlightedLinkClassName = 'graph-drawer__link--not-highlighted';
    const requiredLinkClassName = 'graph-drawer__link--required';
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
              if (this.props.furtherHighlightingNodeID) {
                const isEdgeAlongFurtherHighlightedPath = this.props.furtherHighlightedPath
                  .find(e => (e.source === edge.source && e.target === edge.target));
                if (isEdgeAlongFurtherHighlightedPath) {
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
                className={`graph-drawer__link ${edgeRequiredClassModifier} ${edgeRelatedClassModifier}`}
                d={edge.pathString}
              />
            );
          })
        }
        { // nodes
          this.props.nodes.map((node) => {
            const IconSVG = getTypeIconSVG(node.type);
            const textTopY = node.textPadding;
            let nodeHighlightedClassModifier = '';
            let nodeClickableClassModifier = '';
            let nodeIsCurrentHighlightingClassModifier = '';
            if (this.props.highlightingNode) {
              nodeClickableClassModifier = this.props.furtherClickableNodeIDs.includes(node.id)
                ? clickableNodeClassName : notClickableNodeClassName;
              if (this.props.furtherHighlightingNodeID) {
                nodeHighlightedClassModifier = this.props.furtherHighlightedPath
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
                      y={textTopY + (i * this.props.fontSize)}
                      textAnchor='middle'
                      alignmentBaseline='hanging'
                      fontSize={this.props.fontSize}
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
  fontSize: PropTypes.number,
  canvasWidth: PropTypes.number,
  canvasHeight: PropTypes.number,
  onHoverNode: PropTypes.func,
  onCancelHoverNode: PropTypes.func,
  onClickNode: PropTypes.func,
  highlightingNode: PropTypes.object,
  relatedNodeIDs: PropTypes.array,
  onFurtherClickNode: PropTypes.func,
  furtherHighlightingNodeID: PropTypes.string,
  furtherClickableNodeIDs: PropTypes.arrayOf(PropTypes.string),
  furtherHighlightedPath: PropTypes.arrayOf(PropTypes.object),
  highlightingNodeSVGElement: PropTypes.object,
  onHighlightingNodeSVGElementUpdated: PropTypes.func,
  isGraphView: PropTypes.bool,
};

GraphDrawer.defaultProps = {
  nodes: [],
  edges: [],
  graphBoundingBox: [],
  layoutInitialized: false,
  fontSize: 10,
  canvasWidth: 1000,
  canvasHeight: 1000,
  onHoverNode: () => {},
  onCancelHoverNode: () => {},
  onClickNode: () => {},
  highlightingNode: null,
  relatedNodeIDs: [],
  onFurtherClickNode: () => {},
  furtherHighlightingNodeID: null,
  furtherClickableNodeIDs: [],
  furtherHighlightedPath: [],
  highlightingNodeSVGElement: null,
  onHighlightingNodeSVGElementUpdated: () => {},
  isGraphView: true,
};


export default GraphDrawer;
