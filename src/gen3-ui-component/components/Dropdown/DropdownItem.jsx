import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DropdownItem extends Component {
  handleClick() {
    if (this.props.disabled) {
      return;
    }
    this.props.onClick();
  }

  render() {
    return (
      <div
        role='button'
        tabIndex={this.props.tabIndex}
        className={`${this.props.className} g3-dropdown__item ${this.props.disabled ? 'g3-dropdown__item--disabled' : ''}`}
        onClick={e => this.handleClick(e)}
        onKeyPress={e => this.handleClick(e)}
      >
        {this.props.leftIcon && (
          <i className={`g3-icon g3-icon--sm g3-icon--${this.props.leftIcon} g3-dropdown__item-icon g3-dropdown__item-icon--left`} />
        )}
        {this.props.children}
        {this.props.rightIcon && (
          <i className={`g3-icon g3-icon--sm g3-icon--${this.props.rightIcon} g3-dropdown__item-icon g3-dropdown__item-icon--right`} />
        )}
      </div>
    );
  }
}

DropdownItem.propTypes = {
  className: PropTypes.string,
  leftIcon: PropTypes.string,
  rightIcon: PropTypes.string,
  onClick: PropTypes.func,
  tabIndex: PropTypes.number,
  disabled: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

DropdownItem.defaultProps = {
  className: '',
  leftIcon: null,
  rightIcon: null,
  onClick: () => {},
  disabled: false,
  tabIndex: 0, // override by Dropdown component
};

export default DropdownItem;
