import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import Spinner from '../Spinner/Spinner';
import 'rc-tooltip/assets/bootstrap_white.css';
import './Button.css';

class Button extends Component {
  handleClick(e) {
    if (this.props.enabled && this.props.onClick && !this.props.isPending) {
      this.props.onClick(e);
    }
  }

  render() {
    const buttonTypeClassName = !this.props.enabled || this.props.isPending ? 'g3-button--disabled' : `g3-button--${this.props.buttonType}`;
    const otherAttrs = {};
    if (this.props.id) otherAttrs.id = this.props.id;
    if (this.props.value) otherAttrs.value = this.props.value;
    const button = (
      <button
        type='button'
        className={`${this.props.className} g3-button ${buttonTypeClassName}`}
        onClick={e => this.handleClick(e)}
        {...otherAttrs}
      >
        {
          this.props.leftIcon && (
            <i className={`g3-icon g3-icon--sm g3-icon--${this.props.leftIcon} g3-button__icon g3-button__icon--left`} />
          )
        }
        { this.props.label }
        {
          this.props.rightIcon && !this.props.isPending
            ? <i className={`g3-icon g3-icon--sm g3-icon--${this.props.rightIcon} g3-button__icon g3-button__icon--right`} />
            : null
        }
        { this.props.isPending ? (
          <div className='g3-button__spinner g3-button__icon--right'>
            <Spinner />
          </div>
        ) : null
        }
      </button>
    );

    return (
      <React.Fragment>
        {
          this.props.tooltipEnabled ? (
            <Tooltip
              placement='bottom'
              overlay={this.props.tooltipText}
              arrowContent={<div className='rc-tooltip-arrow-inner' />}
            >
              {button}
            </Tooltip>
          ) : button
        }
      </React.Fragment>
    );
  }
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
  buttonType: PropTypes.oneOf(['primary', 'secondary', 'default']),
  enabled: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  leftIcon: PropTypes.string,
  rightIcon: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  id: PropTypes.string,
  value: PropTypes.string,
  tooltipEnabled: PropTypes.bool,
  tooltipText: PropTypes.string,
  isPending: PropTypes.bool,
};

Button.defaultProps = {
  buttonType: 'primary',
  enabled: true,
  className: '',
  onClick: () => {},
  leftIcon: null,
  rightIcon: null,
  type: 'button',
  id: null,
  value: null,
  tooltipEnabled: false,
  tooltipText: null,
  isPending: false,
};

export default Button;
