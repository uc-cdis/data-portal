import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import TextInput from './TextInput';
import EnumInput from './EnumInput';

/** @typedef {'Number' | 'Text'} DataType */

/**
 *
 * @param {Object} props
 * @param {string} props.description
 * @param {string} props.name
 * @param {React.ChangeEventHandler} props.onChange
 * @param {(name: string, newEnum: { value: string }) => void} props.onChangeEnum
 * @param {(formSchema: Object) => void} props.onUpdateFormSchema
 * @param {Object[]} props.property
 * @param {boolean} props.required
 * @param {string} [props.value]
 */
function OneOfInput({
  description,
  name,
  onChange,
  onChangeEnum,
  onUpdateFormSchema,
  property,
  required,
  value,
}) {
  const [dataType, setDataType] = useState(/** @type {DataType} */ ('Text'));
  useEffect(() => {
    onUpdateFormSchema({ [name]: dataType === 'Number' ? 'number' : 'string' });
  }, []);
  /** @type {React.ChangeEventHandler<HTMLInputElement>} */
  function handleDataTypeChange(event) {
    const newDataType = /** @type {DataType} */ (event.target.value);
    setDataType(newDataType);
    onUpdateFormSchema({
      [name]: newDataType === 'Number' ? 'number' : 'string',
    });
  }

  if ('enum' in property[0] && 'enum' in property[1])
    return (
      <EnumInput
        name={name}
        options={[...property[0].enum, ...property[1].enum]}
        required={required}
        description={description}
        onChange={onChangeEnum}
      />
    );

  if (property[0].type === 'string' && property[1].type === 'null')
    return (
      <TextInput
        name={name}
        value={value}
        required={required}
        description={description}
        onChange={onChange}
      />
    );

  return (
    <div>
      What is your data type for {name}?
      <br />
      <label htmlFor='textDataType'>
        <input
          id='textDataType'
          type='radio'
          value='Text'
          checked={dataType === 'Text'}
          onChange={handleDataTypeChange}
        />
        Text
      </label>
      <label htmlFor='numberDataType'>
        <input
          id='numberDataType'
          type='radio'
          value='Number'
          checked={dataType === 'Number'}
          onChange={handleDataTypeChange}
        />
        Number
      </label>
      {dataType === 'Number' && (
        <TextInput
          name={name}
          value={value}
          description={description}
          required={required}
          onChange={onChange}
        />
      )}
      {dataType === 'Text' && (
        <EnumInput
          name={name}
          options={property[0].enum}
          required={required}
          description={description}
          onChange={onChangeEnum}
        />
      )}
    </div>
  );
}

OneOfInput.propTypes = {
  description: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeEnum: PropTypes.func.isRequired,
  onUpdateFormSchema: PropTypes.func.isRequired,
  property: PropTypes.array.isRequired,
  required: PropTypes.bool.isRequired,
  value: PropTypes.any,
};

export default OneOfInput;
