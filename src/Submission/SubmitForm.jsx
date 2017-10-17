import React, { Component } from 'react';
import styled from 'styled-components';
import { Toggle } from 'material-ui';
import PropTypes from 'prop-types';

import { Dropdown, Input, Label } from '../theme';
import { jsonToString } from '../utils';


export const RequiredNotification = styled.span`
  color:#d45252;
  margin:5px 0 0 0;
  display:inline;
  float: ${props => (props.istext ? 'right' : '')};
`;

const InputDescription = styled.span`
  font-size: 1rem;
  display:inline-block;
  width: 750px;
`;


const UploadFormButton = styled.button`
  border: 1px solid darkgreen;
  display:inline-block;
  color: darkgreen;
  margin: 1em 0em;
  &:hover,
  &:active,
  &:focus {
    color: #2e842e;
    border-color: #2e842e;
  }
  border-radius: 3px;
  padding: 0px 8px;
  cursor: pointer;
  line-height: 2em;
  font-size: 1em;
  margin-right: 1em;
  background-color:white;
`;

const AnyOfSubProps = styled.div`
  margin-left:50px;
`;

class TextInput extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    required: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onUpdateFormSchema: PropTypes.func,
    propertyType: PropTypes.string,
  };
  static getDefaultProps = {
    onUpdateFormSchema: () => {},
    propertyType: undefined,
    value: undefined,
  };

  componentWillMount() {
    if (this.props.onUpdateFormSchema !== undefined) {
      this.props.onUpdateFormSchema({ [this.props.name]: this.props.propertyType });
    }
  }
  render() {
    return (
      <div>
        <Label htmlFor={this.props.name}> {this.props.name}: </Label>
        {this.props.description !== '' && <InputDescription>{this.props.description}</InputDescription>}
        <br />
        <Input type="text" name={this.props.name} value={this.props.value || ''} required={this.props.required} onChange={this.props.onChange} />
        {this.props.required && <RequiredNotification> {'*'} </RequiredNotification>}
      </div>
    );
  }
}

class EnumInput extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    required: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onUpdateFormSchema: PropTypes.func,
    propertyType: PropTypes.string,
  };
  static getDefaultProps = {
    onUpdateFormSchema: () => {},
    propertyType: null,
  };
  state = {
    chosenEnum: '',
  };

  componentWillMount() {
    if (this.props.onUpdateFormSchema !== undefined) {
      this.props.onUpdateFormSchema({ [this.props.name]: this.props.propertyType });
    }
  }
  render() {
    const options = this.props.options.map(option => ({ label: option, value: option }));

    const onChangeEnumWrapper = (newValue) => {
      this.setState({
        chosenEnum: newValue,
      });
      this.props.onChange(this.props.name, newValue);
    };
    return (
      <div>
        <Label htmlFor={this.props.name}> {this.props.name}: </Label>
        {this.props.description !== '' && <InputDescription>{this.props.description}</InputDescription>}
        <br />
        <Dropdown
          name={this.props.name}
          options={options}
          required={this.props.required}
          value={this.state.chosenEnum}
          onChange={onChangeEnumWrapper}
        />
        {this.props.required && <RequiredNotification> {'*'} </RequiredNotification>}
        <br />
      </div>
    );
  }
}

class OneOfInput extends Component {
  // couldn't make a generalized component as I would like to, so I am shortcircuiting the logic

  static propTypes = {
    property: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.any,
    required: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onChangeEnum: PropTypes.func.isRequired,
    onUpdateFormSchema: PropTypes.func.isRequired,
  };

  static getDefaultProps = {
    value: undefined,
  };

  state = {
    selectedOption: 'Text',
  };
  componentWillMount() {
    if (this.state.selectedOption === 'Number') {
      this.props.onUpdateFormSchema({ [this.props.name]: 'number' });
    } else {
      this.props.onUpdateFormSchema({ [this.props.name]: 'string' });
    }
  }
  render() {
    const radioChange = (newValue) => {
      this.setState({
        selectedOption: newValue.target.value,
      });
      const option = newValue.target.value;
      if (option === 'Number') {
        this.props.onUpdateFormSchema({ [this.props.name]: 'number' });
      } else {
        this.props.onUpdateFormSchema({ [this.props.name]: 'string' });
      }
    };

    if (this.props.property[0].hasOwnProperty('enum') && this.props.property[1].hasOwnProperty('enum')) {
      const options = this.props.property[0].enum.concat(this.props.property[1].enum);
      return (
        <EnumInput
          name={this.props.name}
          options={options}
          required={this.props.required}
          description={this.props.description}
          onChange={this.props.onChangeEnum}
        />
      );
    } else if (this.props.property[0].type === 'string' && this.props.property[1].type === 'null') {
      return (
        <TextInput
          name={this.props.name}
          value={this.props.value}
          required={this.props.required}
          description={this.props.description}
          onChange={this.props.onChange}
        />
      );
    }
    return (
      <div>
          What is your data type for {this.props.name}?
        <br />
        <label>
          <input type="radio" value="Text" checked={this.state.selectedOption === 'Text'} onChange={radioChange} />
              Text
        </label>

        <label>
          <input type="radio" value="Number" checked={this.state.selectedOption === 'Number'} onChange={radioChange} />
              Number
        </label>
        {this.state.selectedOption === 'Number' &&
        <TextInput
          name={this.props.name}
          value={this.props.value}
          description={this.props.description}
          required={this.props.required}
          onChange={this.props.onChange}
        />
        }
        {this.state.selectedOption === 'Text' &&
        <EnumInput
          name={this.props.name}
          options={this.props.property[0].enum}
          required={this.props.required}
          description={this.props.description}
          onChange={this.props.onChangeEnum}
        />
        }
      </div>
    );
  }
}

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
            <TextInput key={property} name={property} value={values ? values[0][property] : ''} required={required && requiredSubprop} description={description} onChange={onChangeAnyOfWrapper} />);
        })}
      </AnyOfSubProps>
    </div>
  );
};

const SubmitNodeForm = ({ node, form, properties, requireds, onChange, onChangeEnum, onChangeAnyOf, onUpdateFormSchema, handleSubmit }) => (
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
      <UploadFormButton type="submit" value="Submit"> Upload submission json from form </UploadFormButton>
    </form>
  </div>
);


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
          {this.state.fill_form && <Dropdown name="nodeType" options={options} value={this.state.chosenNode} onChange={updateChosenNode} />}
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
