import React from 'react';
import PropTypes from 'prop-types';
import Select, { components } from 'react-select';
import './InputWithIcon.less';

// HACK (@mpingram) Use a custom option class just to apply the '.Select-option'
// class to the option components, so that the dataUpload integration tests work (which expect
// this class to be present)
const Option = props => (<components.Option className={'Select-option'} {...props} />);

class InputWithIcon extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className={'input-with-icon'.concat(this.props.className ? ` ${this.props.className}` : '')}>
          {
            // HACK (@mpingram) Include the `.Select-arrow` and `.Select-menu-outer` classes here,
            // in addition to the custom Option class, due to integration tests expecting
            // a clickable element with this class to be present here.
            this.props.inputOptions ? (
              <Select
                styles={{ control: provided => ({ ...provided, width: '100%' }) }}
                className={`${this.props.inputClassName} Select-menu-outer Select-arrow`}
                value={{ value: this.props.inputValue, label: this.props.inputValue }}
                components={{ Option }}
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
          this.props.shouldDisplayText ?
            <p
              className={'input-with-icon__text'.concat(this.props.textClassName ? ` ${this.props.textClassName}` : '')}
            >
              {this.props.text}
            </p>
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
