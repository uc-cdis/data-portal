import React from 'react';
import PropTypes from 'prop-types';
import './DropdownButton.css';

/**
 * @typedef {Object} DropdownButtonProps
 * @property {() => void} [afterClick]
 * @property {'primary' | 'secondary'} [buttonType]
 * @property {React.ReactNode} children
 * @property {string} [className]
 * @property {boolean} [disabled]
 * @property {() => void} [handleTriggerMenu]
 * @property {string} [label]
 * @property {boolean} [menuOpen]
 * @property {React.RefObject} [menuTriggerElementRef]
 * @property {() => void} [onClick]
 * @property {string} [rightIcon]
 * @property {boolean} [split]
 */

function DropdownButton({
  afterClick = () => {},
  buttonType = 'primary',
  children,
  className = '',
  disabled = false,
  handleTriggerMenu = () => {},
  label = 'Dropdown Button',
  menuOpen = false,
  menuTriggerElementRef,
  onClick = () => {},
  rightIcon = '',
  split = false,
}) {
  function handleClick() {
    if (!disabled) {
      onClick();
      afterClick();
    }
  }

  const wrapperDisableStatusClassName = disabled
    ? 'g3-dropdown-button__wrapper--disabled'
    : '';

  const buttonTypeClassName = `g3-dropdown-button__button--${buttonType}`;
  const buttonIsSplitClassName = split
    ? 'g3-dropdown-button__button--with-split-trigger'
    : 'g3-dropdown-button__button--without-split-trigger';

  const menuTriggerButtonTypeClassName = `g3-dropdown-button__menu-trigger--${buttonType}`;

  return (
    <div
      ref={menuTriggerElementRef}
      className={`g3-dropdown-button__wrapper ${wrapperDisableStatusClassName} ${
        className || ''
      }`}
    >
      {/* Render dropdown button  */}
      <button
        type='button'
        className={`g3-dropdown-button__button ${buttonIsSplitClassName} ${buttonTypeClassName}`}
        onClick={split ? handleClick : handleTriggerMenu}
        aria-label={label}
      >
        {children}
        {split || (
          <i
            className={`${
              rightIcon === ''
                ? 'g3-dropdown-button__icon'
                : `g3-icon g3-icon--${rightIcon}`
            }`}
          />
        )}
      </button>

      {/* Render split menu trigger if need  */}
      {split && (
        <button
          type='button'
          className={`g3-dropdown-button__menu-trigger ${menuTriggerButtonTypeClassName}`}
          onClick={handleTriggerMenu}
        >
          <i
            className={`g3-dropdown-button__icon ${
              menuOpen ? 'g3-dropdown-button__icon--menu-opened' : ''
            }`}
          />
        </button>
      )}
    </div>
  );
}

DropdownButton.propTypes = {
  afterClick: PropTypes.func,
  buttonType: PropTypes.oneOf(['primary', 'secondary']),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  handleTriggerMenu: PropTypes.func,
  label: PropTypes.string,
  menuOpen: PropTypes.bool,
  menuTriggerElementRef: PropTypes.object,
  onClick: PropTypes.func,
  rightIcon: PropTypes.string,
  split: PropTypes.bool,
};

export default DropdownButton;
