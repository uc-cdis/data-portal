import PropTypes from 'prop-types';
import './GraphEdge.css';

function GraphEdge({ edge, isFaded, isHalfFaded, isHighlighted }) {
  const edgeRequiredClassModifier = edge.required ? 'graph-edge--required' : '';
  const edgeFadedClassModifier = isFaded ? 'graph-edge--faded' : '';
  const edgeHalfFadedClassModifier = isHalfFaded
    ? 'graph-edge--half-faded'
    : '';
  const edgeHighlightedClassModifier = isHighlighted
    ? 'graph-edge--highlighted'
    : '';
  return (
    <path
      className={`graph-edge 
          ${edgeRequiredClassModifier} 
          ${edgeFadedClassModifier} 
          ${edgeHalfFadedClassModifier} 
          ${edgeHighlightedClassModifier}`}
      d={edge.pathString}
    />
  );
}

GraphEdge.propTypes = {
  edge: PropTypes.object.isRequired,
  isFaded: PropTypes.bool.isRequired,
  isHalfFaded: PropTypes.bool.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
};

export default GraphEdge;
