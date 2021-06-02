import React from 'react';
import PropTypes from 'prop-types';

function DropdownItem({
  className,
  leftIcon,
  rightIcon,
  onClick,
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
      className={`${className} g3-dropdown__item ${
        disabled ? 'g3-dropdown__item--disabled' : ''
      }`}
      onClick={handleClick}
      onKeyPress={(e) => {
        if (e.charCode === 13 || e.charCode === 32) {
          e.preventDefault();
          handleClick();
        }
      }}
      role='button'
      tabIndex={0}
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
};

export default DropdownItem;
