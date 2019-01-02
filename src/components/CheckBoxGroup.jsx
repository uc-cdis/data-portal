import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './CheckBoxGroup.less';

export class CheckBoxGroup extends Component {
  static propTypes = {
    listItems: PropTypes.arrayOf(PropTypes.string).isRequired,
    groupName: PropTypes.string.isRequired,
    selectedItems: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
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
          {'More options'}
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
      <div className='checkbox-group'>
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
            <label className='checkbox-group__label' htmlFor={item}>{item}</label>
          </div>
        ))}
        {this.displayOptions()}
      </div>
    );
  }
}

export default CheckBoxGroup;
