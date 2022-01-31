import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { overrideSelectTheme } from '../utils';
import './EnumInput.css';

/**
 * @param {Object} props
 * @param {string} props.description
 * @param {string} props.name
 * @param {(name: string, newEnum: { value: string }) => void} props.onChange
 * @param {(formSchema: any) => void} [props.onUpdateFormSchema]
 * @param {string[]} props.options
 * @param {string} [props.propertyType]
 * @param {boolean} props.required
 */
function EnumInput({
  description,
  name,
  onChange,
  onUpdateFormSchema,
  options,
  propertyType = null,
  required,
}) {
  useEffect(() => {
    onUpdateFormSchema?.({ [name]: propertyType });
  }, []);

  const [currentEnum, setCurrentEnum] = useState({ label: '', value: '' });
  const enumOptions = options.map((option) => ({
    label: option,
    value: option,
  }));

  return (
    <div>
      <label className='enum-input__label' htmlFor={name}>
        {' '}
        {name}:{' '}
      </label>
      {description !== '' && (
        <span className='enum-input__input-description'>{description}</span>
      )}
      <br />
      <Select
        inputId={name}
        name={name}
        options={enumOptions}
        value={currentEnum}
        onChange={(newEnum) => {
          setCurrentEnum(newEnum);
          onChange(name, newEnum);
        }}
        className='enum-input__select'
        theme={overrideSelectTheme}
      />
      {required && (
        <span className='enum-input__required-notification'> {'*'} </span>
      )}
      <br />
    </div>
  );
}

EnumInput.propTypes = {
  description: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdateFormSchema: PropTypes.func,
  options: PropTypes.array.isRequired,
  propertyType: PropTypes.string,
  required: PropTypes.bool.isRequired,
};

export default EnumInput;
