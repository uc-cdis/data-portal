import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { overrideSelectTheme } from '../utils';
import './InputWithIcon.less';

/**
 * @typedef {Object} InputWithIconProps
 * @property {string} [inputId]
 * @property {string} [inputClassName]
 * @property {(option?: { label: string; value: string; }) => void} inputOnChange
 * @property {{ label: string; value: string; }[]} [inputOptions]
 * @property {string} [inputPlaceholderText]
 * @property {string} [inputValue]
 * @property {boolean} [shouldDisplayIcon]
 * @property {React.ElementType} iconSvg
 */

/** @param {InputWithIconProps} props */
function InputWithIcon({
  inputId,
  inputOptions = null,
  inputClassName = '',
  inputValue = '',
  inputPlaceholderText = '',
  inputOnChange,
  shouldDisplayIcon = false,
  iconSvg,
}) {
  const Icon = iconSvg;
  return (
    <div className='input-with-icon'>
      {inputOptions ? (
        <Select
          inputId={inputId}
          styles={{
            control: (provided) => ({ ...provided, width: '100%' }),
          }}
          className={inputClassName}
          classNamePrefix={'react-select'}
          value={{
            value: inputValue,
            label: inputValue,
          }}
          placeholder={inputPlaceholderText}
          options={inputOptions}
          onChange={inputOnChange}
          theme={overrideSelectTheme}
        />
      ) : (
        <input
          id={inputId}
          type='text'
          className={inputClassName}
          onBlur={() => inputOnChange()}
        />
      )}
      {shouldDisplayIcon && <Icon className='input-with-icon__icon' />}
    </div>
  );
}

InputWithIcon.propTypes = {
  inputClassName: PropTypes.string,
  inputId: PropTypes.string,
  inputOnChange: PropTypes.func.isRequired,
  inputOptions: PropTypes.array,
  inputPlaceholderText: PropTypes.string,
  inputValue: PropTypes.string,
  iconSvg: PropTypes.func.isRequired,
  shouldDisplayIcon: PropTypes.bool,
};

export default InputWithIcon;
