import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';
import Select from 'react-select';
import { jsonToString } from '../utils';
import SubmitNodeForm from './SubmitNodeForm';
import './SubmitForm.less';

/**
 * Form-based data submission.  The results of this form submission are subsequently
 * processed by the SubmitTSV component, and treated
 * the same way uploaded tsv/json data is treated.
 */
class SubmitForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenNode: { value: null, label: '' },
      fill_form: false,
      form: {},
    };
  }

  onFormToggle = () => {
    this.setState((prevState) => ({
      fill_form: !prevState.fill_form,
    }));
  };

  onChange = (event) => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    this.setState((prevState) => ({
      form: {
        ...prevState.form,
        [name]: value,
      },
    }));
  };

  onChangeEnum = (name, newValue) => {
    this.setState((prevState) => ({
      form: { ...prevState.form, [name]: newValue.value },
    }));
  };

  onChangeAnyOf = (name, event, properties) => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const subname = target.name;

    if (this.state.form[name] === null || this.state.form[name] === undefined) {
      this.setState((prevState) => ({
        form: {
          ...prevState.form,
          [name]: [{ [subname]: value }],
        },
      }));
    } else if (properties.every((prop) => prop in this.state.form[name])) {
      this.setState((prevState) => ({
        form: {
          ...prevState.form,
          [name]: [...prevState.form[name], { [subname]: value }],
        },
      }));
    } else {
      this.setState((prevState) => ({
        form: {
          ...prevState.form,
          [name]: [
            ...prevState.form[name].slice(0, prevState.form[name].length - 2),
            {
              ...prevState.form[name][prevState.form[name].length - 1],
              [subname]: value,
            },
          ],
        },
      }));
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const value = jsonToString(
      this.state.form,
      this.props.submission.formSchema
    );
    this.props.onUploadClick(value, 'application/json');
  };

  render() {
    const { dictionary, nodeTypes } = this.props.submission;
    const node = dictionary[this.state.chosenNode.value];
    const options = nodeTypes.map((nodeType) => ({
      value: nodeType,
      label: nodeType,
    }));

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
          <label style={{ display: 'block' }}>
            Use Form Submission
            <Switch onChange={this.onFormToggle} />
          </label>

          {this.state.fill_form && (
            <Select
              name='nodeType'
              options={options}
              value={this.state.chosenNode}
              onChange={updateChosenNode}
              className='submit-form__select'
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: 'var(--pcdc-color__primary)',
                },
              })}
            />
          )}
        </form>
        {this.state.chosenNode.value !== null && this.state.fill_form && (
          <div>
            <h5> Properties: </h5>
            <span className='submit-form__required-notification'>
              {' '}
              * Denotes Required Property{' '}
            </span>
            <br />
            <SubmitNodeForm
              node={node}
              form={this.state.form}
              properties={Object.keys(node.properties).filter(
                (prop) => node.systemProperties.indexOf(prop) < 0
              )}
              requireds={'required' in node ? node.required : []}
              onChange={this.onChange}
              onChangeEnum={this.onChangeEnum}
              onChangeAnyOf={this.onChangeAnyOf}
              onUpdateFormSchema={this.props.onUpdateFormSchema}
              handleSubmit={this.handleSubmit}
            />
          </div>
        )}
      </div>
    );
  }
}

SubmitForm.propTypes = {
  submission: PropTypes.object.isRequired,
  onUploadClick: PropTypes.func.isRequired,
  onUpdateFormSchema: PropTypes.func.isRequired,
};

export default SubmitForm;
