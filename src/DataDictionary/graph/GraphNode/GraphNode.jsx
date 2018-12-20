import React from 'react';
import PropTypes from 'prop-types';
import { getCategoryIconSVG } from '../../NodeCategories/helper';
import { MatchedIndicesShape } from '../../utils';
import { getNodeTitleSVGFragment } from '../../highlightHelper';
import './GraphNode.css';

class GraphNode extends React.Component {
  constructor(props) {
    super(props);
    this.svgElement = React.createRef();
  }

  getSVGElement() {
    return this.svgElement.current;
  }

  render() {
    if (!(this.props.node.id !== undefined && this.props.node.type !== undefined
      && this.props.node.textPadding !== undefined && this.props.node.topCenterX !== undefined
      && this.props.node.topCenterY !== undefined && this.props.node.width !== undefined
      && this.props.node.height !== undefined && this.props.node.color !== undefined
      && this.props.node.names !== undefined && this.props.node.iconRadius !== undefined)
      && this.props.node.textLineGap !== undefined && this.props.node.fontSize !== undefined) {
      return null;
    }
    const nodeFadedClassModifier = this.props.isFaded
      ? 'graph-node--faded' : '';
    const nodeHalfFadedClassModifier = this.props.isHalfFaded
      ? 'graph-node--half-faded' : '';
    const nodeDashedClassModifier = this.props.isDashed
      ? 'graph-node--dashed' : '';
    const nodeClickableClassModifier = this.props.isClickable
      ? 'graph-node--clickable' : 'graph-node--not-clickable';
    const nodeIsCurrentHighlightingClassModifier = this.props.isHighlightingNode
      ? 'graph-drawer__node--current-highlighting' : '';
    const IconSVG = getCategoryIconSVG(this.props.node.type);
    return (
      <g
        ref={this.svgElement}
        key={this.props.node.id}
        transform={`translate(${this.props.node.topCenterX}, ${this.props.node.topCenterY}) `}
        className={`graph-node 
          ${nodeFadedClassModifier} 
          ${nodeHalfFadedClassModifier} 
          ${nodeDashedClassModifier} 
          ${nodeClickableClassModifier} 
          ${nodeIsCurrentHighlightingClassModifier}`}
        onMouseOver={this.props.onMouseOver}
        onMouseOut={this.props.onMouseOut}
        onClick={this.props.onClick}
        id={this.props.node.id}
      >
        <rect
          className='graph-node__rect'
          x={-this.props.node.width / 2}
          y={0}
          width={this.props.node.width}
          height={this.props.node.height}
          rx={4}
          ry={4}
          stroke={this.props.node.color}
        />
        {
          getNodeTitleSVGFragment(
            this.props.node.names,
            this.props.matchedNodeNameIndices,
            this.props.node.fontSize,
            this.props.node.textPadding,
            this.props.node.textLineGap,
          )
        }
        {
          <g
            transform={`translate(${-this.props.node.iconRadius}, ${-this.props.node.iconRadius})`}
          >
            {
              IconSVG ? <IconSVG /> : (
                <circle
                  cx={this.props.node.iconRadius}
                  cy={this.props.node.iconRadius}
                  r={this.props.node.iconRadius}
                  fill={this.props.node.color}
                />
              )
            }
          </g>
        }
      </g>
    );
  }
}

const GraphNodeShape = PropTypes.shape({
  id: PropTypes.string,
  type: PropTypes.string,
  textPadding: PropTypes.number,
  topCenterX: PropTypes.number,
  topCenterY: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  names: PropTypes.arrayOf(PropTypes.string),
  iconRadius: PropTypes.number,
  textLineGap: PropTypes.number,
  fontSize: PropTypes.number,
});

GraphNode.propTypes = {
  node: GraphNodeShape.isRequired,
  isHighlightingNode: PropTypes.bool.isRequired,
  isFaded: PropTypes.bool.isRequired,
  isHalfFaded: PropTypes.bool.isRequired,
  isDashed: PropTypes.bool.isRequired,
  isClickable: PropTypes.bool.isRequired,
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func,
  onClick: PropTypes.func,
  matchedNodeNameIndices: MatchedIndicesShape,
};

GraphNode.defaultProps = {
  onMouseOver: () => {},
  onMouseOut: () => {},
  onClick: () => {},
  matchedNodeNameIndices: [],
};

export default GraphNode;

