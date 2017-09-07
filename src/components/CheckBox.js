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
  state = {
    selected_items: []
  };

  static propTypes = {
    listItems: PropTypes.array,
    group_name: PropTypes.string,
    title: PropTypes.string,
    onChange: PropTypes.func,
  };

  onChangeBox = (item) => {
    let pos = this.state.selected_items.indexOf(item);
    if (pos === -1)
      this.setState( ({selected_items}) => {
        selected_items.push(item);
        return {selected_items: selected_items};
      });
    else
      this.setState( ({selected_items}) => {
        selected_items.splice(pos, 1);
        return {selected_items: selected_items};
      });
  };

  render () {
    return(
      <div>
        {this.props.title}
        {this.props.listItems.map((item, i)=>{
          return(
            <div key={i}>
              <input type="checkbox" name={this.props.group_name}
                     value={item} id={item}
                     checked={this.state.selected_items.includes(item)}
                     onChange={() => Promise.resolve(this.onChangeBox(item)).then(
                       () => this.props.onChange(this.props.group_name, this.state.selected_items))
                     }
              />
              <LabelCheckBox for={item}>{item}</LabelCheckBox>
            </div>
          )
        })}
      </div>
    );
  }
}
