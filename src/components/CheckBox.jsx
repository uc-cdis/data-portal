import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import { Label } from '../theme';

const LabelCheckBox = styled(Label)`
    white-space: nowrap;
    text-overflow: ellipsis;
    min-width: 0px;
    overflow: hidden;
    padding: 0px 0.25rem;
    margin-left: 0.3rem;
    vertical-align: middle;
    line-height: 1.75
`;

const CheckBox = styled.div`
   padding: 1em 0em;
   border-bottom: 2px solid #7d7474;
`;


export class CheckBoxGroup extends Component {
  static propTypes = {
    listItems: PropTypes.array,
    group_name: PropTypes.string,
    selected_items: PropTypes.array,
    title: PropTypes.string,
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      collapsed: (props.listItems.length > 5) ? 1 : 0
    };
  }

  onChangeBox = (item) => {
    const pos = this.props.selected_items.indexOf(item);
    let selectedItems = [];
    if (pos === -1) { 
      selectedItems = [...this.props.selected_items, item];
    } else { 
      selectedItems = [...this.props.selected_items.slice(0, pos), ...this.props.selected_items.slice(pos + 1)]; 
    }
    const state = { [this.props.group_name]: selectedItems };
    this.props.onChange(state);
  };

  render() {
    const selectedItems = this.props.selected_items;
    // console.log(selectedItems);
    let listItems = (this.state.collapsed === 1)
      ? this.props.listItems.slice(0, 3)
      : this.props.listItems;

    return (
      <CheckBox>
        {this.props.title}
        {listItems.map((item, i) => (
          <div key={i}>
            <input
              type="checkbox" name={this.props.group_name}
              value={item} id={item}
              checked={selectedItems.includes(item)}
              onChange={() => this.onChangeBox(item)}
            />
            <LabelCheckBox for={item}>{item}</LabelCheckBox>
          </div>
        ))}
        {
          (this.state.collapsed === 1) ?
            <a href="#/" onClick={() => this.setState({collapsed: 2})}>{'More options'}</a>
            : ((this.state.collapsed === 2)
            ? <a href="#/" onClick={() => this.setState({collapsed: 1})}>{'Fewer options'}</a>
            : "")
        }
      </CheckBox>
    );
  }
}

export const StyledCheckBoxGroup = styled(CheckBoxGroup)`
    padding: 0em 1em;
    border-bottom: 2px solid #717b85;
`;

