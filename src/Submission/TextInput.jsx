import { useEffect } from 'react';
import PropTypes from 'prop-types';
import './TextInput.css';

/**
 * @param {Object} props
 * @param {string} props.description
 * @param {string} props.name
 * @param {React.ChangeEventHandler} props.onChange
 * @param {(formSchema: any) => void} [props.onUpdateFormSchema]
 * @param {string} [props.propertyType]
 * @param {boolean} props.required
 * @param {string} [props.value]
 */
function TextInput({
  description,
  name,
  onChange,
  onUpdateFormSchema,
  propertyType = null,
  required,
  value,
}) {
  useEffect(() => {
    onUpdateFormSchema?.({ [name]: propertyType });
  }, []);

  return (
    <div>
      <label className='text-input__label' htmlFor={name}>
        {' '}
        {name}:{' '}
      </label>
      {description !== '' && (
        <span className='text-input__input-description'>{description}</span>
      )}
      <br />
      <input
        id={name}
        className='text-input__input'
        type='text'
        name={name}
        value={value || ''}
        required={required}
        onChange={onChange}
      />
      {required && (
        <span className='text-input__required-notification'> {'*'} </span>
      )}
    </div>
  );
}

TextInput.propTypes = {
  description: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdateFormSchema: PropTypes.func,
  propertyType: PropTypes.string,
  required: PropTypes.bool.isRequired,
  value: PropTypes.string,
};

export default TextInput;
