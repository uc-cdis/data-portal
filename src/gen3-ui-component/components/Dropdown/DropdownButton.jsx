import React from 'react';
import PropTypes from 'prop-types';
import './DropdownButton.css';

function DropdownButton({
  split,
  className,
  label,
  onClick,
  handleTriggerMenu,
  menuOpen,
  afterClick,
  menuTriggerElementRef,
  buttonType,
  rightIcon,
  disabled,
  children,
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
        label={label}
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
  split: PropTypes.bool,
  className: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
  handleTriggerMenu: PropTypes.func,
  menuOpen: PropTypes.bool,
  afterClick: PropTypes.func,
  menuTriggerElementRef: PropTypes.object,
  buttonType: PropTypes.oneOf(['primary', 'secondary']),
  rightIcon: PropTypes.string,
  disabled: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

DropdownButton.defaultProps = {
  split: false,
  className: '',
  label: 'Dropdown Button',
  onClick: () => {},
  buttonType: 'primary',
  rightIcon: '',
  // override by Dropdown component:
  handleTriggerMenu: () => {},
  menuOpen: false,
  afterClick: () => {},
  menuTriggerElementRef: {},
  disabled: false,
};

export default DropdownButton;
