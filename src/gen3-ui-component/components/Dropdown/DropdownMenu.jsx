import React from 'react';
import PropTypes from 'prop-types';

function DropdownMenu({ className, menuOpen, children }) {
  return (
    <div
      className={`g3-dropdown__menu ${
        menuOpen ? 'g3-dropdown__menu--opened' : ''
      } ${className || ''}`}
    >
      {children}
    </div>
  );
}

DropdownMenu.propTypes = {
  className: PropTypes.string,
  menuOpen: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

DropdownMenu.defaultProps = {
  className: '',
  menuOpen: false, // override by Dropdown component
};

export default DropdownMenu;
