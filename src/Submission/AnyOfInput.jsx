import React from 'react';
import PropTypes from 'prop-types';
import TextInput from './TextInput';
import './AnyOfInput.less';

const AnyOfInput = ({
  name,
  values,
  node,
  properties,
  required,
  requireds,
  onChange,
}) => {
  // this is smelly code because it reuses logic from SubmitNodeForm,
  // I'd like to extract some of the code into another function

  const onChangeAnyOfWrapper = (event) => {
    onChange(name, event, properties);
  };

  return (
    <div>
      <h6 className='any-of-input__name'>{name}:</h6>
      {required && <span className='any-of-input__required-notification'> {'*'} </span>}
      <div className='any-of-input__sub-props'>
        {properties.map((property) => {
          let description = ('description' in node.properties[property]) ? node.properties[property].description : '';
          if (description === '') {
            description = ('term' in node.properties[property]) ? node.properties[property].term.description : '';
          }
          const requiredSubprop = (requireds.indexOf(property) > -1);
          // we use index 0 of values because AnyOfInput is hardcoded
          // to be an array of length 1, an upcoming feature should be to add to this array
          return (
            <TextInput
              key={property}
              name={property}
              value={values ? values[0][property] : ''}
              required={required && requiredSubprop}
              description={description}
              onChange={onChangeAnyOfWrapper}
            />);
        })}
      </div>
    </div>
  );
};

AnyOfInput.propTypes = {
  name: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired,
  node: PropTypes.any.isRequired,
  properties: PropTypes.array.isRequired,
  required: PropTypes.bool.isRequired,
  requireds: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};

AnyOfInput.defaultProps = {
  requireds: [],
};

export default AnyOfInput;
