import React from 'react';
import PropTypes from 'prop-types';

/**
 * @typedef {Object} DropdownMenuProps
 * @property {React.ReactNode} children
 * @property {string} [className]
 * @property {boolean} [menuOpen]
 */

/** @param {DropdownMenuProps} props */
function DropdownMenu({ children, className = '', menuOpen = false }) {
  return (
    <div
      className={`g3-dropdown__menu ${
        menuOpen ? 'g3-dropdown__menu--opened' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

DropdownMenu.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  className: PropTypes.string,
  menuOpen: PropTypes.bool,
};

export default DropdownMenu;
