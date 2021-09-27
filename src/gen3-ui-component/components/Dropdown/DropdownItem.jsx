import React from 'react';
import PropTypes from 'prop-types';

/**
 * @typedef {Object} DropdownItemProps
 * @property {React.ReactNode} children
 * @property {string} [className]
 * @property {boolean} [disabled]
 * @property {string} [leftIcon]
 * @property {() => void} [onClick]
 * @property {string} [rightIcon]
 */

/** @param {DropdownItemProps} props */
function DropdownItem({
  children,
  className = '',
  disabled = false,
  leftIcon,
  onClick = () => {},
  rightIcon,
}) {
  function handleClick() {
    if (!disabled) onClick();
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
      aria-label='Dropdown item'
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
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  leftIcon: PropTypes.string,
  onClick: PropTypes.func,
  rightIcon: PropTypes.string,
};

export default DropdownItem;
