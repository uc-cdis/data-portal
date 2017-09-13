import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {Label} from "../theme";

const LabelCheckBox = styled(Label)`
    white-space: nowrap;
    text-overflow: ellipsis;
    min-width: 0px;
    overflow: hidden;
    padding: 0px 0.25rem;
    margin-left: 0.3rem;
    vertical-align: middle;
`;

export class CheckBoxGroup extends Component{
  static propTypes = {
    listItems: PropTypes.array,
    group_name: PropTypes.string,
    selected_items: PropTypes.array,
    title: PropTypes.string,
    onChange: PropTypes.func,
  };

  onChangeBox = (item) => {
    let pos = this.props.selected_items.indexOf(item);
    if (pos === -1)
      this.props.selected_items.push(item);
    else
      this.props.selected_items.splice(pos, 1);
    let state = {[this.props.group_name]: this.props.selected_items};
    this.props.onChange(state);
  };

  render () {
    let selected_items = this.props.selected_items;
    console.log(selected_items);
    return(
      <div>
        {this.props.title}
        {this.props.listItems.map((item, i)=>{
          return(
            <div key={i}>
              <input type="checkbox" name={this.props.group_name}
                     value={item} id={item}
                     checked={selected_items.includes(item)}
                     onChange={() => this.onChangeBox(item)}
              />
              <LabelCheckBox for={item}>{item}</LabelCheckBox>
            </div>
          )
        })}
      </div>
    );
  }
}
