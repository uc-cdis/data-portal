import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './TextInput.less';

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
        <label className='text-input__label' htmlFor={this.props.name}> {this.props.name}: </label>
        {this.props.description !== '' && <span className='text-input__input-description'>{this.props.description}</span>}
        <br />
        <input
          className='text-input__input'
          type='text'
          name={this.props.name}
          value={this.props.value || ''}
          required={this.props.required}
          onChange={this.props.onChange}
        />
        {this.props.required && <span className='text-input__required-notification'> {'*'} </span>}
      </div>
    );
  }
}

export default TextInput;
