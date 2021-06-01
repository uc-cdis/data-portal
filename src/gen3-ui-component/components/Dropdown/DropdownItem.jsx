import React from 'react';
import PropTypes from 'prop-types';

function DropdownItem({
  className,
  leftIcon,
  rightIcon,
  onClick,
  tabIndex,
  disabled,
  children,
}) {
  function handleClick() {
    if (!disabled) {
      onClick();
    }
  }

  return (
    <div
      role='button'
      tabIndex={tabIndex}
      className={`${className} g3-dropdown__item ${
        disabled ? 'g3-dropdown__item--disabled' : ''
      }`}
      onClick={handleClick}
      onKeyPress={handleClick}
    >
      {leftIcon && (
        <i
          className={`g3-icon g3-icon--sm g3-icon--${leftIcon} g3-dropdown__item-icon g3-dropdown__item-icon--left`}
        />
      )}
      {children}
      {rightIcon && (
        <i
          className={`g3-icon g3-icon--sm g3-icon--${rightIcon} g3-dropdown__item-icon g3-dropdown__item-icon--right`}
        />
      )}
    </div>
  );
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
