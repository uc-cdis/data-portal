import React from 'react';
import PropTypes from 'prop-types';
import './Chip.css';

/**
 * @typedef {Object} ChipProps
 * @property {() => void} onClearButtonClick
 * @property {JSX.Element} text
 */

/** @param {ChipProps} props */
function Chip({ onClearButtonClick, text }) {
  return (
    <div className='g3-chip'>
      <div className='g3-chip__text'>{text}</div>
      <div
        className='g3-chip__clear-btn'
        onClick={onClearButtonClick}
        onKeyPress={(e) => {
          if (e.charCode === 13 || e.charCode === 32) {
            e.preventDefault();
            onClearButtonClick();
          }
        }}
        role='button'
        tabIndex={0}
        aria-label='Clear'
      >
        <i className='g3-icon g3-icon--sm g3-icon-color__lightgray g3-icon--sm g3-icon--cross' />
      </div>
    </div>
  );
}

Chip.propTypes = {
  onClearButtonClick: PropTypes.func.isRequired,
  text: PropTypes.node.isRequired,
};

export default Chip;
