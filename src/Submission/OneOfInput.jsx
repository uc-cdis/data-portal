import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextInput from './TextInput';
import EnumInput from './EnumInput';

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

    if (Object.prototype.hasOwnProperty.call(this.props.property[0], 'enum')
      && Object.prototype.hasOwnProperty.call(this.props.property[1], 'enum')) {
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
        <label htmlFor='textDataType'>
          <input
            id='textDataType'
            type='radio'
            value='Text'
            checked={this.state.selectedOption === 'Text'}
            onChange={radioChange}
          />
              Text
        </label>

        <label htmlFor='numberDataType'>
          <input
            id='numberDataType'
            type='radio'
            value='Number'
            checked={this.state.selectedOption === 'Number'}
            onChange={radioChange}
          />
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

export default OneOfInput;
