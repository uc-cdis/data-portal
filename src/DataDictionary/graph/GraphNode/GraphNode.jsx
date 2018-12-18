import React from 'react';
import PropTypes from 'prop-types';
import { getCategoryIconSVG } from '../../NodeCategories/helper';
import { MatchedIndicesShape } from '../../utils';
import './GraphNode.css';

class GraphNode extends React.Component {
  constructor(props) {
    super(props);
    this.svgElement = React.createRef();
  }

  getSVGElement() {
    return this.svgElement.current;
  }

  getNodeTitleFragment = () => {
    const nodeTitleFragment = [];
    let currentRowIndex = 0;
    let rowStartIndex = 0;
    let rowEndIndex;
    const nodeNameRows = this.props.node.names;
    const matchedNodeNameIndices = this.props.matchedNodeNameIndices;
    let currentHighlightIndex = 0;
    while (currentRowIndex < nodeNameRows.length) {
      const currentRowStr = nodeNameRows[currentRowIndex];
      rowEndIndex = rowStartIndex + currentRowStr.length;
      const textY = this.props.node.textPadding +
        (currentRowIndex * (this.props.node.fontSize + this.props.node.textLineGap));
      const textAttr = {
        key: currentRowIndex,
        x: 0,
        y: textY,
        textAnchor: 'middle',
        alignmentBaseline: 'hanging',
        fontSize: this.props.node.fontSize,
        className: 'graph-node__text',
      };
      const tspanAttrBase = {
        textAnchor: 'middle',
        alignmentBaseline: 'hanging',
        fontSize: this.props.node.fontSize,
      };
      const tspanAttr = {
        ...tspanAttrBase,
        className: 'graph-node__tspan',
      };
      const tspanHighlightAttr = {
        ...tspanAttrBase,
        className: 'graph-node__tspan graph-node__tspan--highlight',
      };
      let cursorInRow = 0;
      const currentRowFragment = [];
      while (currentHighlightIndex < matchedNodeNameIndices.length) {
        const highlightStartIndex = matchedNodeNameIndices[currentHighlightIndex][0];
        const highlightEndIndex = matchedNodeNameIndices[currentHighlightIndex][1] + 1;
        if (highlightStartIndex > rowEndIndex) {
          currentRowFragment.push((
            <tspan key={cursorInRow} {...tspanAttr}>
              {currentRowStr.substring(cursorInRow)}
            </tspan>
          ));
          cursorInRow = currentRowStr.length;
          break;
        }
        const highlightStartIndexInRow = highlightStartIndex - rowStartIndex;
        const highlightEndIndexInRow = highlightEndIndex - rowStartIndex;
        if (cursorInRow < highlightStartIndexInRow) {
          currentRowFragment.push((
            <tspan key={cursorInRow} {...tspanAttr}>
              {currentRowStr.substring(cursorInRow, highlightStartIndexInRow)}
            </tspan>
          ));
          cursorInRow = highlightStartIndexInRow;
        }
        if (highlightEndIndex <= rowEndIndex) {
          currentRowFragment.push((
            <tspan key={cursorInRow} {...tspanHighlightAttr}>
              {currentRowStr.substring(cursorInRow, highlightEndIndexInRow)}
            </tspan>
          ));
          cursorInRow = highlightEndIndexInRow;
          currentHighlightIndex += 1;
        } else {
          currentRowFragment.push((
            <tspan key={cursorInRow} {...tspanHighlightAttr}>
              {currentRowStr.substring(cursorInRow)}
            </tspan>
          ));
          cursorInRow = currentRowStr.lenght;
          break;
        }
      }
      if (cursorInRow < currentRowStr.length) {
        currentRowFragment.push((
          <tspan key={cursorInRow} {...tspanAttr}>{currentRowStr.substring(cursorInRow)}</tspan>
        ));
      }
      nodeTitleFragment.push((
        <text {...textAttr}>{currentRowFragment}</text>
      ));
      currentRowIndex += 1;
      rowStartIndex += currentRowStr.length + 1;
    }
    return nodeTitleFragment;
  };

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
    const nodeClickableClassModifier = this.props.isClickable
      ? 'graph-node--clickable' : 'graph-node--not-clickable';
    const nodeIsCurrentHighlightingClassModifier = this.props.isHighlightingNode
      ? this.props.highlightingNodeClassName : '';
    const IconSVG = getCategoryIconSVG(this.props.node.type);
    return (
      <g
        ref={this.svgElement}
        key={this.props.node.id}
        transform={`translate(${this.props.node.topCenterX}, ${this.props.node.topCenterY}) `}
        className={`graph-node 
          ${nodeFadedClassModifier} 
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
        {this.getNodeTitleFragment()}
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
  highlightingNodeClassName: PropTypes.string.isRequired,
  isHighlightingNode: PropTypes.bool.isRequired,
  isFaded: PropTypes.bool.isRequired,
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

