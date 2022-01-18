import PropTypes from 'prop-types';
import Button from '../../../gen3-ui-component/components/Button';
import './NodePopup.css';

/** @typedef {import('../../types').DdgraphState} DdgraphState */

/**
 * @param {Object} props
 * @param {DdgraphState['canvasBoundingRect']} props.canvasBoundingRect
 * @param {DdgraphState['graphNodesSVGElements']} props.graphNodesSVGElements
 * @param {DdgraphState['highlightingNode']} props.highlightingNode
 * @param {() => void} props.onClosePopup
 * @param {() => void} props.onOpenOverlayPropertyTable
 */
function NodePopup({
  canvasBoundingRect = { top: 0, left: 0 },
  graphNodesSVGElements = null,
  highlightingNode = null,
  onClosePopup,
  onOpenOverlayPropertyTable,
}) {
  if (!highlightingNode) return null;

  const defaultBoundingBox = { top: 0, left: 0, width: 0, bottom: 0 };
  const svgBoundingBox =
    graphNodesSVGElements?.[highlightingNode.id]?.getBoundingClientRect?.() ??
    defaultBoundingBox;
  const popupLeft =
    svgBoundingBox.left - canvasBoundingRect.left + svgBoundingBox.width / 2;
  const popupTop = svgBoundingBox.bottom - canvasBoundingRect.top;

  return (
    <div className='node-popup' style={{ top: popupTop, left: popupLeft }}>
      {highlightingNode && (
        <div className='node-popup__wrapper'>
          <span
            className='node-popup__close'
            onClick={onClosePopup}
            onKeyPress={(e) => {
              if (e.charCode === 13 || e.charCode === 32) {
                e.preventDefault();
                onClosePopup?.();
              }
            }}
            role='button'
            tabIndex={0}
            aria-label='Close popup'
          >
            <i className='node-popup__close-icon g3-icon g3-icon--cross' />
          </span>
          <div className='node-popup__content'>
            <li className='node-popup__list-item'>
              {highlightingNode.requiredPropertiesCount} required properties
            </li>
            <li className='node-popup__list-item'>
              {highlightingNode.optionalPropertiesCount} optional properties
            </li>
            <Button
              className='node-popup__button'
              onClick={onOpenOverlayPropertyTable}
              label='Open properties'
              buttonType='secondary'
            />
          </div>
          <span className='node-popup__arrow node-popup__arrow--outer' />
          <span className='node-popup__arrow node-popup__arrow--inner' />
        </div>
      )}
    </div>
  );
}

NodePopup.propTypes = {
  canvasBoundingRect: PropTypes.object,
  graphNodesSVGElements: PropTypes.object,
  highlightingNode: PropTypes.object,
  onClosePopup: PropTypes.func,
  onOpenOverlayPropertyTable: PropTypes.func,
};

export default NodePopup;
