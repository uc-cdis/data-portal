import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import './NodePopup.css';

class NodePopup extends React.Component {
  handleClickPropertyButton = () => {
    this.props.onOpenOverlayPropertyTable();
  }

  render() {
    if (!this.props.highlightingNode) {
      return (
        <React.Fragment />
      );
    }
    const highlightingNodeSVGElement = this.props
      .graphNodesSVGElements && this.props
      .graphNodesSVGElements[this.props.highlightingNode.id];
    const svgBoundingBox = highlightingNodeSVGElement
      && highlightingNodeSVGElement.getBoundingClientRect
      ? highlightingNodeSVGElement.getBoundingClientRect()
      : { top: 0, left: 0, width: 0, bottom: 0 };
    const popupLeft = (svgBoundingBox.left - this.props.canvasBoundingRect.left)
      + (svgBoundingBox.width / 2);
    const popupTop = svgBoundingBox.bottom - this.props.canvasBoundingRect.top;
    return (
      <div
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
                <Button
                  className='node-popup__button'
                  onClick={this.handleClickPropertyButton}
                  label='Open properties'
                  buttonType='secondary'
                />
              </div>
              <span className='node-popup__arrow node-popup__arrow--outer' />
              <span className='node-popup__arrow node-popup__arrow--inner' />
              <i
                className='node-popup__close g3-icon g3-icon--cross'
                onClick={this.props.onClosePopup}
                onKeyPress={this.props.onClosePopup}
                role='button'
                tabIndex={0}
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
  graphNodesSVGElements: PropTypes.object,
  onClosePopup: PropTypes.func,
  canvasBoundingRect: PropTypes.object,
  onOpenOverlayPropertyTable: PropTypes.func,
};

NodePopup.defaultProps = {
  highlightingNode: null,
  graphNodesSVGElements: null,
  onClosePopup: () => {},
  canvasBoundingRect: { top: 0, left: 0 },
  onOpenOverlayPropertyTable: () => {},
};

export default NodePopup;
