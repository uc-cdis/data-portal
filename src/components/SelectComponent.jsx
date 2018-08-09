import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import './SelectComponent.less';

const makeDefaultSelectedState = value => ({
  selectedValue: value,
});

export default class SelectComponent extends Component {
  static propTypes = {
    title: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.number),
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    selectedValue: PropTypes.number,
  };

  static defaultProps = {
    title: '',
    values: [],
    placeholder: 'Select...',
    selectedValue: 0,
    onChange: () => {},
  };

  constructor(props) {
    super(props);
    this.state = makeDefaultSelectedState(this.props.selectedValue);
    this.resetState = this.resetState.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedValue !== nextProps.selectedValue) {
      this.setState({ selectedValue: nextProps.selectedValue });
    }
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
      <div className='selection'>
        <span className='selection__title'>{this.props.title}</span>
        <Select
          className='selection__select'
          name={this.props.title}
          options={options}
          value={this.state.selectedValue}
          placeholder={this.props.placeholder}
          onChange={event => this.doChangeSelectedValue(event.value)}
          clearable={false}
        />
      </div>
    );
  }
}
