import PropTypes from 'prop-types';
import './NodeTooltip.css';

function NodeTooltip({
  hoveringNode,
  canvasBoundingRect,
  graphNodesSVGElements,
}) {
  if (!hoveringNode) return null;
  const hoveringNodeSVGElement =
    graphNodesSVGElements && graphNodesSVGElements[hoveringNode.id];
  const svgBoundingBox = hoveringNodeSVGElement
    ? hoveringNodeSVGElement.getBoundingClientRect()
    : { top: 0, left: 0, width: 0 };
  const gap = 10;
  const tooltipLeft =
    svgBoundingBox.left - canvasBoundingRect.left + svgBoundingBox.width / 2;
  const tooltipBottom = window.innerHeight - svgBoundingBox.top + gap;
  return (
    <div
      className='node-tooltip'
      style={{
        bottom: tooltipBottom,
        left: tooltipLeft,
      }}
    >
      {hoveringNode && (
        <div className='node-tooltip__wrapper'>
          <span className='node-tooltip__text'>{hoveringNode.label}</span>
          <span className='node-tooltip__arrow' />
        </div>
      )}
    </div>
  );
}

NodeTooltip.propTypes = {
  hoveringNode: PropTypes.object,
  canvasBoundingRect: PropTypes.object,
  graphNodesSVGElements: PropTypes.object,
};

NodeTooltip.defaultProps = {
  hoveringNode: null,
  canvasBoundingRect: { top: 0, left: 0 },
  graphNodesSVGElements: {},
};

export default NodeTooltip;
