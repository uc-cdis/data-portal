import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import './SelectComponent.less';

const makeDefaultSelectedState = (value) => ({
  selectedValue: value,
});

class SelectComponent extends Component {
  constructor(props) {
    super(props);
    this.state = makeDefaultSelectedState(this.props.selectedValue);
    this.resetState = this.resetState.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    return props.selectedValue !== state.selectedValue
      ? { selectedValue: props.selectedValue }
      : null;
  }

  resetState() {
    this.setState(makeDefaultSelectedState(this.props.selectedValue));
  }

  doChangeSelectedValue(option) {
    const value = option ? option.value : null;
    this.setState({ selectedValue: value });
    this.props.onChange(value);
  }

  render() {
    const options = this.props.values.map((value) => ({ value, label: value }));

    return (
      <div className='selection'>
        <span className='selection__title'>{this.props.title}</span>
        <Select
          className='selection__select'
          name={this.props.title}
          options={options}
          value={{
            value: this.state.selectedValue,
            label: this.state.selectedValue,
          }}
          placeholder={this.props.placeholder}
          onChange={(option) => this.doChangeSelectedValue(option)}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: 'var(--pcdc-color__primary)',
            },
          })}
        />
      </div>
    );
  }
}

SelectComponent.propTypes = {
  title: PropTypes.string,
  values: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  selectedValue: PropTypes.number,
};

SelectComponent.defaultProps = {
  title: '',
  values: [],
  placeholder: 'Select...',
  selectedValue: 0,
  onChange: () => {},
};

export default SelectComponent;
