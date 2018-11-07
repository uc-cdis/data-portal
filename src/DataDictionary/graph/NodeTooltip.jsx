import React from 'react';
import PropTypes from 'prop-types';
import './NodeTooltip.css';

class NodeTooltip extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const svgBoundingBox = this.props.hoveringNodeSVGElement ? this.props.hoveringNodeSVGElement.getBoundingClientRect() : { top: 0, left: 0, width: 0 };
    const tooltipWidth = 120;
    const gap = 10;
    const tooltipLeft = svgBoundingBox.left + svgBoundingBox.width / 2;
    const tooltipBottom = window.innerHeight - svgBoundingBox.top + gap;
    return (
      <div
        className='node-tooltip'
        style={{
          bottom: tooltipBottom,
          left: tooltipLeft,
        }}
      >
        {
          this.props.hoveringNode && (
            <div className='node-tooltip__wrapper'>
              <span className='node-tooltip__text'>
                {this.props.hoveringNode.label}
              </span>
              <span className='node-tooltip__arrow' />
            </div>
          )
        }
        <div className='node-tooltip__canvas-ctm-placeholder'>
          {typeof (this.props.svgCTM)}
        </div>
      </div>
    );
  }
}

NodeTooltip.propTypes = {
  hoveringNode: PropTypes.object,
  hoveringNodeSVGElement: PropTypes.object,
  svgCTM: PropTypes.object,
};

NodeTooltip.defaultProps = {
  hoveringNode: null,
  hoveringNodeSVGElement: null,
  svgCTM: null,
};

export default NodeTooltip;
