import React from 'react';
import PropTypes from 'prop-types';

import './Chip.css';

const Chip = props => (
  <div className='g3-chip'>
    <div className='g3-chip__text'>
      {props.text}
    </div>
    <div
      className='g3-chip__clear-btn'
      role='button'
      tabIndex={0}
      onClick={props.onClearButtonClick}
      onKeyPress={props.onClearButtonClick}
    >
      <i className='g3-icon g3-icon--sm g3-icon-color__lightgray g3-icon--sm g3-icon--cross' />
    </div>
  </div>
);

Chip.propTypes = {
  text: PropTypes.node.isRequired,
  onClearButtonClick: PropTypes.func.isRequired,
};

export default Chip;
