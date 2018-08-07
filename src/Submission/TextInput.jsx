import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Input, Label } from '../theme';

const RequiredNotification = styled.span`
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
        <Input
          type='text'
          name={this.props.name}
          value={this.props.value || ''}
          required={this.props.required}
          onChange={this.props.onChange}
        />
        {this.props.required && <RequiredNotification> {'*'} </RequiredNotification>}
      </div>
    );
  }
}

export default TextInput;
