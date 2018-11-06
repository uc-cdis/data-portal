import React from 'react';
import PropTypes from 'prop-types';
import './NodePopup.css';

class NodePopup extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.tooltipElement = React.createRef();
  }

  render() {
    const svgBoundingBox = this.props.highlightingNodeSVGElement ? this.props.highlightingNodeSVGElement.getBoundingClientRect() : { top: 0, left: 0, width: 0, bottom: 0 };
    const popupWidth = 240;
    const popupLeft = svgBoundingBox.left + svgBoundingBox.width / 2;
    const popupTop = svgBoundingBox.bottom;
    return (
      <div
        ref={this.tooltipElement}
        className='node-popup'
        style={{
          top: popupTop,
          left: popupLeft,
        }}
      >
        {
          this.props.highlightingNode && (
            <div className='node-popup__wrapper'>
              <div className='node-popup__content'>
                <li className='node-popup__list-item'>{this.props.highlightingNode.requiredPropertiesCount} required properties</li>
                <li className='node-popup__list-item'>{this.props.highlightingNode.optionalPropertiesCount} optional properties</li>
                <button className='node-popup__button'>Open properties</button>
              </div>
              <span className='node-popup__arrow node-popup__arrow--outer' />
              <span className='node-popup__arrow node-popup__arrow--inner' />
              <i
                className='node-popup__close g3-icon g3-icon--cross'
                onClick={this.props.onClosePopup}
              />
            </div>
          )
        }
      </div>
    );
  }
}

NodePopup.propTypes = {
  highlightingNode: PropTypes.object,
  highlightingNodeSVGElement: PropTypes.object,
  svgCTM: PropTypes.object,
  onClosePopup: PropTypes.func,
};

NodePopup.defaultProps = {
  highlightingNode: null,
  highlightingNodeSVGElement: null,
  svgCTM: null,
  onClosePopup: () => {},
};

export default NodePopup;
