import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import './InputWithIcon.less';

function InputWithIcon({
  className,
  inputOptions,
  inputClassName,
  inputValue,
  inputPlaceholderText,
  inputOnChange,
  shouldDisplayIcon,
  shouldDisplayText,
  iconSvg,
  iconClassName,
  textClassName,
  text,
}) {
  return (
    <>
      <div
        className={'input-with-icon'.concat(className ? ` ${className}` : '')}
      >
        {inputOptions ? (
          <Select
            styles={{
              control: (provided) => ({ ...provided, width: '100%' }),
            }}
            className={`${inputClassName}`}
            classNamePrefix={'react-select'}
            value={{
              value: inputValue,
              label: inputValue,
            }}
            placeholder={inputPlaceholderText}
            options={inputOptions}
            onChange={inputOnChange}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: 'var(--pcdc-color__primary)',
              },
            })}
          />
        ) : (
          <input
            type='text'
            className={inputClassName}
            onBlur={inputOnChange}
          />
        )}
        {shouldDisplayIcon && (
          <iconSvg
            className={'input-with-icon__icon'.concat(
              iconClassName ? ` ${iconClassName}` : ''
            )}
          />
        )}
      </div>
      {shouldDisplayText && (
        <p
          className={'input-with-icon__text'.concat(
            textClassName ? ` ${textClassName}` : ''
          )}
        >
          {text}
        </p>
      )}
    </>
  );
}

InputWithIcon.propTypes = {
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  inputValue: PropTypes.string,
  inputPlaceholderText: PropTypes.string,
  inputOptions: PropTypes.array,
  inputOnChange: PropTypes.func.isRequired,
  iconSvg: PropTypes.func.isRequired,
  iconClassName: PropTypes.string,
  shouldDisplayIcon: PropTypes.bool,
  shouldDisplayText: PropTypes.bool,
  text: PropTypes.string,
  textClassName: PropTypes.string,
};

InputWithIcon.defaultProps = {
  className: '',
  inputClassName: '',
  inputPlaceholderText: '',
  inputOptions: null,
  inputValue: '',
  iconClassName: '',
  shouldDisplayIcon: false,
  shouldDisplayText: false,
  text: null,
  textClassName: '',
};

export default InputWithIcon;
