import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';


const makeDefaultSelectedState = (value) => ({
  selectedValue: value
});

export const SelectionDiv = styled.div`
  font-size: 15px;
`;


export default class SelectComponent extends Component {
  static propTypes = {
    title: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.number),
    onChange: PropTypes.func,
    defaultSelect: PropTypes.any,
    selectedValue: PropTypes.number
  };

  static defaultProps = {
    title: "",
    values: [],
    defaultSelect: 0,
    selectedValue: 0,
    onChange: () => {}
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedValue !== nextProps.selectedValue)
      this.setState({selectedValue: nextProps.selectedValue});
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
    this.setState({selectedValue: value});
    this.props.onChange(value);
  }

  render() {
    return (
      <SelectionDiv>
        <label>{this.props.title}</label>
        <select value={this.state.selectedValue}
                onChange={(event) => this.doChangeSelectedValue(event.nativeEvent.target.value)}>
          {this.props.values.map((item, i) => (
              <option key={i} value={item}>{item}</option>
            )
          )}
        </select>
      </SelectionDiv>
    )
  }
}
