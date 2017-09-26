import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
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

  onChangeBox = (item) => {
    const pos = this.props.selected_items.indexOf(item);
    let selected_items = [];
    if (pos === -1) { selected_items = [...this.props.selected_items, item]; } else { selected_items = [...this.props.selected_items.slice(0, pos), ...this.props.selected_items.slice(pos + 1)]; }
    const state = { [this.props.group_name]: selected_items };
    this.props.onChange(state);
  };

  render() {
    const selected_items = this.props.selected_items;
    //console.log(selected_items);
    return (
      <CheckBox>
        {this.props.title}
        {this.props.listItems.map((item, i) => (
          <div key={i}>
            <input
              type="checkbox" name={this.props.group_name}
              value={item} id={item}
              checked={selected_items.includes(item)}
              onChange={() => this.onChangeBox(item)}
            />
            <LabelCheckBox for={item}>{item}</LabelCheckBox>
          </div>
        ))}
      </CheckBox>
    );
  }
}

export const StyledCheckBoxGroup = styled(CheckBoxGroup)`
    padding: 0em 1em;
    border-bottom: 2px solid #717b85;
`;

