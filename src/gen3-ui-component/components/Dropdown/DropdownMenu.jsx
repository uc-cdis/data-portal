import React from 'react';
import PropTypes from 'prop-types';
import DropdownItem from './DropdownItem';

function DropdownMenu({ className, menuOpen, children }) {
  let count = 0;
  return (
    <div
      className={`g3-dropdown__menu ${
        menuOpen ? 'g3-dropdown__menu--opened' : ''
      } ${className || ''}`}
    >
      {React.Children.map(children, (child) => {
        if (child.type === DropdownItem) {
          count += 1;
          return React.cloneElement(child, {
            tabIndex: count,
          });
        }
        return child;
      })}
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
