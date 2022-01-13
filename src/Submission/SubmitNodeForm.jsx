import PropTypes from 'prop-types';
import OneOfInput from './OneOfInput';
import EnumInput from './EnumInput';
import AnyOfInput from './AnyOfInput';
import TextInput from './TextInput';
import './SubmitNodeForm.css';

/**
 * @param {Object} props
 * @param {Object} props.form
 * @param {React.FormEventHandler} props.handleSubmit
 * @param {Object} props.node
 * @param {React.ChangeEventHandler} props.onChange
 * @param {(name: string, event: React.ChangeEvent<HTMLInputElement>, properties: string[]) => void} props.onChangeAnyOf
 * @param {(name: string, newEnum: { value: string }) => void} props.onChangeEnum
 * @param {(formSchema: any) => void} props.onUpdateFormSchema
 * @param {string[]} props.properties
 * @param {string[]} props.requireds
 */
function SubmitNodeForm({
  form,
  handleSubmit,
  node,
  onChange,
  onChangeAnyOf,
  onChangeEnum,
  onUpdateFormSchema,
  properties,
  requireds = [],
}) {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        {properties.map((propertyName) => {
          if (propertyName === 'type') return null;

          const property = node.properties[propertyName];
          const description =
            property?.description ?? property?.term?.description ?? '';
          const required = requireds.indexOf(propertyName) > -1;

          if ('enum' in property)
            return (
              <EnumInput
                key={propertyName}
                description={description}
                name={propertyName}
                onChange={onChangeEnum}
                onUpdateFormSchema={onUpdateFormSchema}
                options={property.enum}
                propertyType='string'
                required={required}
              />
            );

          if ('oneOf' in property)
            return (
              <OneOfInput
                key={propertyName}
                description={description}
                name={propertyName}
                onChange={onChange}
                onChangeEnum={onChangeEnum}
                onUpdateFormSchema={onUpdateFormSchema}
                property={property.oneOf}
                required={required}
                value={form[propertyName]}
              />
            );

          if ('anyOf' in property)
            return (
              <AnyOfInput
                key={propertyName}
                name={propertyName}
                node={property.anyOf[0].items}
                onChange={onChangeAnyOf}
                properties={Object.keys(property.anyOf[0].items.properties)}
                required={required}
                requireds={requireds}
                values={form[propertyName]}
              />
            );

          return (
            <TextInput
              key={propertyName}
              name={propertyName}
              onUpdateFormSchema={onUpdateFormSchema}
              propertyType={
                /* just use the first type if it allows multiple types */
                Array.isArray(property.type) ? property.type[0] : property.type
              }
              value={form[propertyName]}
              required={required}
              description={description}
              onChange={onChange}
            />
          );
        })}
        <button
          type='submit'
          value='Submit'
          className='button-primary-white submit-node-form__upload-form-button'
        >
          Upload submission json from form
        </button>
      </form>
    </div>
  );
}

SubmitNodeForm.propTypes = {
  form: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  node: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeAnyOf: PropTypes.func.isRequired,
  onChangeEnum: PropTypes.func.isRequired,
  onUpdateFormSchema: PropTypes.func.isRequired,
  properties: PropTypes.arrayOf(PropTypes.string).isRequired,
  requireds: PropTypes.arrayOf(PropTypes.string),
};

export default SubmitNodeForm;
