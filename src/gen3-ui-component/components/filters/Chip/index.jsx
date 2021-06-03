import React from 'react';
import PropTypes from 'prop-types';

import './Chip.css';

function Chip({ text, onClearButtonClick }) {
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
      >
        <i className='g3-icon g3-icon--sm g3-icon-color__lightgray g3-icon--sm g3-icon--cross' />
      </div>
    </div>
  );
}

Chip.propTypes = {
  text: PropTypes.node.isRequired,
  onClearButtonClick: PropTypes.func.isRequired,
};

export default Chip;
