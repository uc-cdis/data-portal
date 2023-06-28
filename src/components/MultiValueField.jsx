import PropTypes from 'prop-types';
import './MultiValueField.css';


/**
 * @typedef {Object} MultiValueFieldProps
 * @property {?{ isError: boolean; message: string | string[] }} [error]
 * @property {React.ReactNode | (({ inputProps, valueContainerProps, valueProps }) => React.ReactNode)} children
 * @property {string | JSX.Element} label
 * @property {string} fieldId
 * @property {string} [className]
 */

/** @param {MultiValueFieldProps} props */
function MultiValueField({ error, children, label, fieldId, className }) {
  let labelId = `${fieldId}-label`;
  let inputId = `${fieldId}-input`;
  let listboxId =  `${fieldId}-listbox`;
  let inputProps = { 
    id: inputId,
    role: 'combobox',
    type: 'text',
    'aria-autocomplete': 'none',
    'aria-controls': listboxId,
    'aria-labelledby': labelId,
    'aria-expanded': 'true'
  };
  let valueContainerProps = { 
    id: listboxId,
    role: 'listbox',
    tabIndex: '0',
    'aria-labelledby': labelId,
    'aria-multiselectable': 'true'
  };
  let valueProps = { role: 'option', 'aria-selected': 'true' };

  return (
    <div className={`multi-value-field__container ${className}`}>
      <span id={labelId} className='multi-value-field__label' role='label'>
        {label}
      </span>
      <div
        className={`multi-value-field__values${
          error && error.isError ? ' multi-value-field__values--error' : ''
        }`}
      >
         {typeof children === 'function' ? children({ inputProps, valueContainerProps, valueProps }) : children}
      </div>
      {error && error.isError && (
        <div className='multi-value-field__error-message'>{error.message}</div>
      )}
    </div>
  );
}

MultiValueField.propTypes = {
  error: PropTypes.shape({
    isError: PropTypes.bool,
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
  }),
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  fieldId: PropTypes.string.isRequired,
  className: PropTypes.string
}

export default MultiValueField;