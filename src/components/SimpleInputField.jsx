import React from 'react';
import PropTypes from 'prop-types';
import './SimpleInputField.css';

/**
 * @param {Object} prop
 * @param {string} prop.label
 * @param {JSX.Element} prop.input
 */
function SimpleInputField({ label, input }) {
  return (
    <div className='simple-input-field__container'>
      <label className='simple-input-field__label'>{label}</label>
      <div className='simple-input-field__input'>{input}</div>
    </div>
  );
}

SimpleInputField.propTypes = {
  label: PropTypes.string,
  input: PropTypes.string,
};

export default SimpleInputField;
