import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Dropdown, Label } from '../theme';

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

export default EnumInput;
