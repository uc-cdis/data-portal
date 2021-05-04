import React from 'react';
import PropTypes from 'prop-types';
import './GraphEdge.css';

class GraphEdge extends React.Component {
  render() {
    const edgeRequiredClassModifier = this.props.edge.required ? 'graph-edge--required' : '';
    const edgeFadedClassModifier = this.props.isFaded ? 'graph-edge--faded' : '';
    const edgeHalfFadedClassModifier = this.props.isHalfFaded ? 'graph-edge--half-faded' : '';
    const edgeHighlightedClassModifier = this.props.isHighlighted ? 'graph-edge--highlighted' : '';
    return (
      <path
        className={`graph-edge 
          ${edgeRequiredClassModifier} 
          ${edgeFadedClassModifier} 
          ${edgeHalfFadedClassModifier} 
          ${edgeHighlightedClassModifier}`}
        d={this.props.edge.pathString}
      />
    );
  }
}

GraphEdge.propTypes = {
  edge: PropTypes.object.isRequired,
  isFaded: PropTypes.bool.isRequired,
  isHalfFaded: PropTypes.bool.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
};

export default GraphEdge;
