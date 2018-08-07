import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Label } from '../theme';

const LabelCheckBox = styled(Label)`
    white-space: nowrap;
    text-overflow: ellipsis;
    min-width: 0px;
    max-width: 12vw;
    overflow: hidden;
    padding: 0px 0.25rem;
    margin-left: 0.3rem;
    vertical-align: middle;
    line-height: 1.75
`;

const CheckBox = styled.div`
   padding: 1em 0em;
   border-bottom: ${props => (props.lastChild ? '0px' : '2px solid #7d7474')};
`;


export class CheckBoxGroup extends Component {
  static propTypes = {
    listItems: PropTypes.arrayOf(PropTypes.string).isRequired,
    groupName: PropTypes.string.isRequired,
    selectedItems: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    lastChild: PropTypes.bool,
  };

  static defaultProps = {
    lastChild: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      collapsed: (props.listItems.length > 5) ? 1 : 0,
    };
  }

  onChangeBox = (item) => {
    const pos = this.props.selectedItems.indexOf(item);
    let selectedItems = [];

    if (pos === -1) {
      selectedItems = [...this.props.selectedItems, item];
    } else {
      selectedItems = [...this.props.selectedItems.slice(0, pos),
        ...this.props.selectedItems.slice(pos + 1)];
    }
    const state = { [this.props.groupName]: selectedItems };
    this.props.onChange(state);
  };

  displayOptions = () => {
    if (this.state.collapsed === 1) {
      return (
        <a href='#/' onClick={() => this.setState({ collapsed: 2 })}>
          {'More Options'}
        </a>
      );
    } else if (this.state.collapsed === 2) {
      return (
        <a href='#/' onClick={() => this.setState({ collapsed: 1 })}>
          {'Fewer options'}
        </a>
      );
    }
    return '';
  };

  render() {
    const selectedItems = this.props.selectedItems;
    // console.log(selectedItems);
    const listItems = (this.state.collapsed === 1)
      ? this.props.listItems.slice(0, 3)
      : this.props.listItems;

    return (
      <CheckBox lastChild={this.props.lastChild}>
        {this.props.title}
        {listItems.map(item => (
          <div key={item}>
            <input
              type='checkbox'
              name={this.props.groupName}
              value={item}
              id={item}
              checked={selectedItems.includes(item)}
              onChange={() => this.onChangeBox(item)}
            />
            <LabelCheckBox for={item}>{item}</LabelCheckBox>
          </div>
        ))}
        {this.displayOptions()}
      </CheckBox>
    );
  }
}

export const StyledCheckBoxGroup = styled(CheckBoxGroup)`
    padding: 0em 1em;
    border-bottom: 2px solid #717b85;
`;
