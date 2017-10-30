import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Select from 'react-select';


const makeDefaultSelectedState = value => ({
  selectedValue: value,
});

export const SelectionDiv = styled.div`
  font-size: 15px;
  position: relative;
  vertical-align: middle;  
  span {
    vertical-align: middle;
    margin-right: 10px;
  }

  .Select-menu-outer {
    top: auto;
    bottom: 100%;
  }
`;
const Dropdown = styled(Select)`
  display: inline-block;
  vertical-align: middle;
`;

export default class SelectComponent extends Component {
  static propTypes = {
    title: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.number),
    onChange: PropTypes.func,
    defaultSelect: PropTypes.any,
    placeholder: PropTypes.string,
    selectedValue: PropTypes.number
  };

  static defaultProps = {
    title: '',
    values: [],
    placeholder: 'Select...',
    defaultSelect: 0,
    selectedValue: 0,
    onChange: () => {},
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedValue !== nextProps.selectedValue) { this.setState({ selectedValue: nextProps.selectedValue }); }
  }

  constructor(props) {
    super(props);
    this.state = makeDefaultSelectedState(this.props.selectedValue);
    this.resetState = this.resetState.bind(this);
  }

  resetState() {
    this.setState(makeDefaultSelectedState(this.props.selectedValue));
  }

  doChangeSelectedValue(value) {
    this.setState({ selectedValue: value });
    this.props.onChange(value);
  }

  render() {
    const options = this.props.values.map(value => ({ value, label: value }));

    return (
      <SelectionDiv>
        <span>{this.props.title}</span>
        <Dropdown
          name={this.props.title}
          options={options}
          value={this.state.selectedValue}
          placeholder={this.props.placeholder}
          onChange={event => this.doChangeSelectedValue(event.value)}
          clearable={false}
        />
      </SelectionDiv>
    );
  }
}
