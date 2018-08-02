import React, { Component } from 'react';
import styled from 'styled-components';
import { Toggle } from 'material-ui';
import PropTypes from 'prop-types';

import { Dropdown } from '../theme';
import { jsonToString } from '../utils';
import TextInput from './TextInput';
import OneOfInput from './OneOfInput';
import EnumInput from './EnumInput';

const RequiredNotification = styled.span`
  color:#d45252;
  margin:5px 0 0 0;
  display:inline;
  float: ${props => (props.istext ? 'right' : '')};
`;

const UploadFormButton = styled.a`
  display:inline-block;
  border-radius: 3px;
  margin-bottom: 10px;
`;

const AnyOfSubProps = styled.div`
  margin-left:50px;
`;

const AnyOfInput = ({ name, values, node, properties, required, requireds, onChange }) => {
  // this is smelly code because it reuses logic from SubmitNodeForm,
  // I'd like to extract some of the code into another function

  const onChangeAnyOfWrapper = (event) => {
    onChange(name, event, properties);
  };

  return (
    <div>
      <h6 style={{ display: 'inline' }}>{name}:</h6>
      {required && <RequiredNotification> {'*'} </RequiredNotification>}
      <AnyOfSubProps>
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
      </AnyOfSubProps>
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


const SubmitNodeForm = ({ node, form, properties, requireds, onChange,
  onChangeEnum, onChangeAnyOf, onUpdateFormSchema,
  handleSubmit }) => (
  <div>
    <form onSubmit={handleSubmit} >
      {properties.map((property) => {
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
              propertyType="string"
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
      <UploadFormButton>
        <button type="submit" value="Submit" className="button-primary-white" style={{ width: '250px' }}>
          Upload submission json from form
        </button>
      </UploadFormButton>
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


/**
 * Form-based data submission.  The results of this form submission are subsequently
 * processed by the SubmitTSV component, and treated
 * the same way uploaded tsv/json data is treated.
 */
class SubmitForm extends Component {
  static propTypes = {
    submission: PropTypes.object.isRequired,
    onUploadClick: PropTypes.func.isRequired,
    onUpdateFormSchema: PropTypes.func.isRequired,
  };

  state = {
    chosenNode: { value: null, label: '' },
    fill_form: false,
    form: {},
  };

  onFormToggle = () => {
    this.setState({
      fill_form: !(this.state.fill_form),
    });
  };

  onChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      form: {
        ...this.state.form,
        [name]: value,
      } });
  };

  onChangeEnum = (name, newValue) => {
    this.setState({
      form: { ...this.state.form,
        [name]: newValue.value,
      } });
  };

  onChangeAnyOf = (name, event, properties) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const subname = target.name;

    if (this.state.form[name] === null || this.state.form[name] === undefined) {
      this.setState({
        form: {
          ...this.state.form,
          [name]: [{ [subname]: value }],
        },
      });
    } else if (properties.every(prop => prop in this.state.form[name])) {
      this.setState({
        form: {
          ...this.state.form,
          [name]: this.state.form[name].push({ [subname]: value }),
        } });
    } else {
      this.setState({
        form: {
          ...this.state.form,
          [name]: [...this.state.form[name].slice(0, this.state.form[name].length - 2),
            { ...this.state.form[name][this.state.form[name].length - 1], [subname]: value }],
        } });
    }
  };
  handleSubmit = (event) => {
    event.preventDefault();

    const value = jsonToString(this.state.form, this.props.submission.formSchema);
    this.props.onUploadClick(value, 'application/json');
  };

  render() {
    const dictionary = this.props.submission.dictionary;
    const nodeTypes = this.props.submission.nodeTypes;
    const node = dictionary[this.state.chosenNode.value];
    const options = nodeTypes.map(nodeType => ({ value: nodeType, label: nodeType }));

    const updateChosenNode = (newValue) => {
      this.setState({
        chosenNode: newValue,
        form: {
          type: newValue.value,
        },
      });
    };


    return (
      <div>
        <form>
          <Toggle label="Use Form Submission" labelStyle={{ width: '' }} onToggle={this.onFormToggle} />
          {this.state.fill_form && <Dropdown
            name="nodeType"
            options={options}
            value={this.state.chosenNode}
            onChange={updateChosenNode}
          />}
        </form>
        {(this.state.chosenNode.value !== null) && this.state.fill_form &&
        <div>
          <h5> Properties: </h5>
          <RequiredNotification istext> * Denotes Required Property </RequiredNotification>
          <br />
          <SubmitNodeForm
            node={node}
            form={this.state.form}
            properties={Object.keys(node.properties)
              .filter(prop => node.systemProperties.indexOf(prop) < 0)}
            requireds={('required' in node) ? node.required : []}
            onChange={this.onChange}
            onChangeEnum={this.onChangeEnum}
            onChangeAnyOf={this.onChangeAnyOf}
            onUpdateFormSchema={this.props.onUpdateFormSchema}
            handleSubmit={this.handleSubmit}
          />
        </div>
        }
      </div>
    );
  }
}

export default SubmitForm;
