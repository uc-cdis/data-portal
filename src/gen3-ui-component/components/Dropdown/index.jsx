import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import DropdownButton from './DropdownButton';
import DropdownItem from './DropdownItem';
import DropdownMenu from './DropdownMenu';
import DropdownMenuDivider from './DropdownMenuDivider';
import './Dropdown.css';

/**
 * @typedef {Object} DropdownProps
 * @property {'primary' | 'secondary' | 'default'} [buttonType]
 * @property {React.ReactNode} children
 * @property {string} [className]
 * @property {boolean} [disabled]
 */

/** @param {DropdownProps} props */
function Dropdown({
  buttonType = 'primary',
  children,
  className = '',
  disabled = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuTriggerElementRef = useRef(undefined);

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleTriggerMenu() {
    if (!disabled) setMenuOpen(!menuOpen);
  }

  useEffect(() => {
    function handleWindowClick(e) {
      if (
        menuTriggerElementRef?.current !== undefined &&
        !menuTriggerElementRef.current.contains(e.target)
      )
        closeMenu();
    }

    if (menuOpen) window.addEventListener('click', handleWindowClick);
    else window.removeEventListener('click', handleWindowClick);

    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, [menuOpen]);

  return (
    <div
      className={`g3-dropdown ${disabled ? 'g3-dropdown--disabled' : ''} ${
        className || ''
      } ${buttonType === 'secondary' ? 'g3-dropdown--secondary' : ''}`}
    >
      {React.Children.map(
        children,
        /** @param {React.ReactElement} child  */
        (child) =>
          React.cloneElement(child, {
            afterClick: closeMenu,
            buttonType,
            disabled,
            handleTriggerMenu,
            menuOpen,
            menuTriggerElementRef,
          })
      )}
    </div>
  );
}

Dropdown.propTypes = {
  buttonType: PropTypes.oneOf(['primary', 'secondary', 'default']),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

/**
 * props:
 *   - className(string): class name
 *   - disabled(bool): whether disabled
 *   - label(stirng): label of the button
 *   - onClick(func): onclick function, ignored when split=false (onClick=triggerMenu)
 *   - split(bool): if true, the trigger button is split
 */
Dropdown.Button = DropdownButton;

/**
 * Wrapper for a list of menu items
 * props:
 *   - className(string): class name
 */
Dropdown.Menu = DropdownMenu;

/**
 * props:
 *   - className(string): class name
 *   - disabled(bool): whether disabled
 *   - leftIcon(string): left icon name
 *   - onClick(func): onclick function
 *   - rightIcon(string): right icon name
 */
Dropdown.Item = DropdownItem;

Dropdown.MenuDivider = DropdownMenuDivider;

export default Dropdown;
