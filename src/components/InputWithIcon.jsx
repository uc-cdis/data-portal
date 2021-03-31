import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import './InputWithIcon.less';

class InputWithIcon extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className={'input-with-icon'.concat(this.props.className ? ` ${this.props.className}` : '')}>
          {
            this.props.inputOptions ? (
              <Select
                styles={{ control: (provided) => ({ ...provided, width: '100%' }) }}
                className={`${this.props.inputClassName}`}
                classNamePrefix={'react-select'}
                value={{ value: this.props.inputValue, label: this.props.inputValue }}
                placeholder={this.props.inputPlaceholderText}
                options={this.props.inputOptions}
                onChange={this.props.inputOnChange}
              />
            ) : (
              <input
                type='text'
                className={this.props.inputClassName}
                onBlur={this.props.inputOnChange}
              />
            )
          }
          {
            this.props.shouldDisplayIcon ? (
              <this.props.iconSvg
                className={'input-with-icon__icon'.concat(this.props.iconClassName ? ` ${this.props.iconClassName}` : '')}
              />
            ) : null
          }
        </div>
        {
          this.props.shouldDisplayText
            ? (
              <p
                className={'input-with-icon__text'.concat(this.props.textClassName ? ` ${this.props.textClassName}` : '')}
              >
                {this.props.text}
              </p>
            )
            : null
        }
      </React.Fragment>
    );
  }
}

InputWithIcon.propTypes = {
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  inputValue: PropTypes.string,
  inputPlaceholderText: PropTypes.string,
  inputOptions: PropTypes.array,
  inputOnChange: PropTypes.func.isRequired,
  iconSvg: PropTypes.func.isRequired,
  iconClassName: PropTypes.string,
  shouldDisplayIcon: PropTypes.bool,
  shouldDisplayText: PropTypes.bool,
  text: PropTypes.string,
  textClassName: PropTypes.string,
};

InputWithIcon.defaultProps = {
  className: '',
  inputClassName: '',
  inputPlaceholderText: '',
  inputOptions: null,
  inputValue: {},
  iconClassName: '',
  shouldDisplayIcon: false,
  shouldDisplayText: false,
  text: null,
  textClassName: '',
};

export default InputWithIcon;
