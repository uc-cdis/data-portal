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

class CheckBox extends Component{
  state = {
    isCheck: false
  };

  render () {
    return(
      <div key={i}>
        <input type="checkbox" name={this.props.group_name}
               value={item} id={item}
               checked={this.state.selected_items.includes(item)}
               onChange={() => {this.onChangeBox(item)}}/>
        <LabelCheckBox for={item}>{item}</LabelCheckBox>
      </div>
    );
  }
}

export class CheckBoxGroup extends Component{
  state = {
    selected_items: []
  };
  onChangeBox = (item) => {
    if (!this.state.selected_items.includes(item))
      this.setState( ({selected_items}) => {
        selected_items.push(item);
        return {selected_items: selected_items};
      });
    else
      this.setState( ({selected_items}) => {
        selected_items.splice(selected_items.indexOf(item), 1);
        return {selected_items: selected_items};
      });
  };
  render () {
    return(
      <div>
        {this.props.title}
        {Object.keys(this.props.listItems).map((item, i)=>{
          return(
            <div key={i}>
              <input type="checkbox" name={this.props.group_name}
                     value={item} id={item}
                     checked={this.state.selected_items.includes(item)}
                     onChange={() => {this.onChangeBox(item)}}/>
              <LabelCheckBox for={item}>{item}</LabelCheckBox>
            </div>
          )
        })}
      </div>
    );
  }
}
