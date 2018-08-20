import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import './EnumInput.less';

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
        <label className='enum-input__label' htmlFor={this.props.name}> {this.props.name}: </label>
        {this.props.description !== '' && <span className='enum-input__input-description'>{this.props.description}</span>}
        <br />
        <Select
          name={this.props.name}
          options={options}
          required={this.props.required}
          value={this.state.chosenEnum}
          onChange={onChangeEnumWrapper}
          className='enum-input__select'
        />
        {this.props.required && <span className='enum-input__required-notification'> {'*'} </span>}
        <br />
      </div>
    );
  }
}

export default EnumInput;
