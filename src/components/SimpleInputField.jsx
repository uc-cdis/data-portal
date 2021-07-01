import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import './SimpleInputField.css';

/**
 * @param {Object} prop
 * @param {string} prop.label
 * @param {JSX.Element} prop.input
 * @param {?{ isError: boolean; message: string }} [prop.error]
 */
function SimpleInputField({ label, input, error }) {
  const inputEl = useRef(input);
  const inputId =
    // id for native input elements, inputId for react-select
    inputEl.current?.props?.id ?? inputEl.current?.props?.inputId ?? undefined;

  return (
    <div className='simple-input-field__container'>
      {label && (
        <label className='simple-input-field__label' htmlFor={inputId}>
          {label}
        </label>
      )}
      <div
        className={`simple-input-field__input${
          error && error.isError ? ' simple-input-field__input--error' : ''
        }`}
      >
        {input}
      </div>
      {error && error.isError && (
        <div className='simple-input-field__error-message'>{error.message}</div>
      )}
    </div>
  );
}

SimpleInputField.propTypes = {
  label: PropTypes.string,
  input: PropTypes.object,
  error: PropTypes.shape({
    isError: PropTypes.bool,
    message: PropTypes.string,
  }),
};

export default SimpleInputField;
