import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DropdownItem from './DropdownItem';

class DropdownMenu extends Component {
  render() {
    let count = 0;
    return (
      <div className={`g3-dropdown__menu ${this.props.menuOpen ? 'g3-dropdown__menu--opened' : ''} ${this.props.className || ''}`}>
        {
          React.Children.map(this.props.children, (child) => {
            if (child.type === DropdownItem) {
              count += 1;
              return React.cloneElement(child, {
                tabIndex: count,
              });
            }
            return child;
          })
        }
      </div>
    );
  }
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
