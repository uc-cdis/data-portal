import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DropdownButton from './DropdownButton';
import DropdownItem from './DropdownItem';
import DropdownMenu from './DropdownMenu';
import DropdownMenuDivider from './DropdownMenuDivider';
import './Dropdown.css';

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
    };
    this.menuTriggerElementRef = React.createRef();
  }

  handleTriggerMenu() {
    if (this.props.disabled) {
      return;
    }
    this.setState(state => (
      { menuOpen: !state.menuOpen }
    ));
  }

  closeMenu() {
    this.setState({ menuOpen: false });
  }

  handleWindowClick(e) {
    if (!this.menuTriggerElementRef || !this.menuTriggerElementRef.current) {
      return;
    }
    if (!this.menuTriggerElementRef.current.contains(e.target)) {
      this.closeMenu();
    }
  }

  bindCancellingEvent() {
    window.addEventListener('click', e => this.handleWindowClick(e));
  }

  unbindCancellingEvent() {
    window.removeEventListener('click', e => this.handleWindowClick(e));
  }

  render() {
    if (this.state.menuOpen) {
      this.bindCancellingEvent();
    } else {
      this.unbindCancellingEvent();
    }
    return (
      <div className={`g3-dropdown ${this.props.disabled ? 'g3-dropdown--disabled' : ''} ${this.props.className || ''} 
                                   ${this.props.buttonType === 'secondary' ? 'g3-dropdown--secondary' : ''}`}
      >
        {
          React.Children.map(this.props.children, child => React.cloneElement(child, {
            handleTriggerMenu: e => this.handleTriggerMenu(e),
            menuOpen: this.state.menuOpen,
            afterClick: e => this.closeMenu(e),
            menuTriggerElementRef: this.menuTriggerElementRef,
            buttonType: this.props.buttonType,
            disabled: this.props.disabled,
          }),
          )
        }
      </div>
    );
  }
}

Dropdown.propTypes = {
  className: PropTypes.string,
  buttonType: PropTypes.oneOf(['primary', 'secondary', 'default']),
  disabled: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

Dropdown.defaultProps = {
  className: '',
  buttonType: 'primary',
  disabled: false,
};

/**
* props:
*   - split(bool): if true, the trigger button is split
*   - label(stirng): label of the button
*   - onClick(func): onclick function, ignored when split=false (onClick=triggerMenu)
*   - className(string): class name
*   - disabled(bool): whether disabled
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
*   - leftIcon(string): left icon name
*   - rightIcon(string): right icon name
*   - onClick(func): onclick function
*   - disabled(bool): whether disabled
*/
Dropdown.Item = DropdownItem;

Dropdown.MenuDivider = DropdownMenuDivider;

export default Dropdown;
