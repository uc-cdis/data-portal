import React from 'react';
import PropTypes from 'prop-types';
import OneOfInput from './OneOfInput';
import EnumInput from './EnumInput';
import AnyOfInput from './AnyOfInput';
import TextInput from './TextInput';
import './SubmitNodeForm.less';

const SubmitNodeForm = ({
  node,
  form,
  properties,
  requireds,
  onChange,
  onChangeEnum,
  onChangeAnyOf,
  onUpdateFormSchema,
  handleSubmit,
}) => (
  <div>
    <form onSubmit={handleSubmit}>{properties.map((property) => {
      let description = ('description' in node.properties[property]) ? node.properties[property].description : '';
      if (description === '') {
        description = ('term' in node.properties[property]) ? node.properties[property].term.description : '';
      }
      const required = (requireds.indexOf(property) > -1);

      if (property === 'type') {
        return null;
      } else if ('enum' in node.properties[property]) {
        return (
          <EnumInput
            key={property}
            name={property}
            options={node.properties[property].enum}
            onChange={onChangeEnum}
            required={required}
            onUpdateFormSchema={onUpdateFormSchema}
            propertyType='string'
            description={description}
          />);
      } else if ('oneOf' in node.properties[property]) {
        return (
          <OneOfInput
            key={property}
            value={form[property]}
            property={node.properties[property].oneOf}
            name={property}
            required={required}
            description={description}
            onChange={onChange}
            onChangeEnum={onChangeEnum}
            onUpdateFormSchema={onUpdateFormSchema}
          />);
      } else if ('anyOf' in node.properties[property]) {
        return (
          <AnyOfInput
            key={property}
            values={form[property]}
            name={property}
            node={node.properties[property].anyOf[0].items}
            properties={Object.keys(node.properties[property].anyOf[0].items.properties)}
            required={required}
            requireds={requireds}
            onChange={onChangeAnyOf}
          />
        );
      }
      let propertyType = node.properties[property].type;
      if (typeof (propertyType) === 'object') {
        /* just use the first type if it allows multiple types */
        propertyType = propertyType[0];
      }
      return (
        <TextInput
          key={property}
          name={property}
          onUpdateFormSchema={onUpdateFormSchema}
          propertyType={propertyType}
          value={form[property]}
          required={required}
          description={description}
          onChange={onChange}
        />);
    })}
    <button type='submit' value='Submit' className='button-primary-white submit-node-form__upload-form-button'>
        Upload submission json from form
    </button>
    </form>
  </div>
);

SubmitNodeForm.propTypes = {
  node: PropTypes.any.isRequired,
  form: PropTypes.object.isRequired,
  properties: PropTypes.object.isRequired,
  requireds: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  onChangeEnum: PropTypes.func.isRequired,
  onChangeAnyOf: PropTypes.func.isRequired,
  onUpdateFormSchema: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

SubmitNodeForm.defaultProps = {
  requireds: [],
};

export default SubmitNodeForm;
