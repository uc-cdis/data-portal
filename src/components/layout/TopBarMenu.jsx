import { useState } from 'react';
import PropTypes from 'prop-types';
import './TopBarMenu.css';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.buttonIcon
 * @param {React.ReactNode | React.ReactNode[]} props.children
 * @param {string} [props.title]
 */
function TopBarMenu({ buttonIcon, children, title }) {
  const [showMenu, setShowMenu] = useState(false);
  function handleMenuBlur(e) {
    if (showMenu && !e.currentTarget.contains(e.relatedTarget))
      setShowMenu(false);
  }
  function toggleMenu() {
    setShowMenu((s) => !s);
  }
  return (
    <span className='top-bar-menu' onBlur={handleMenuBlur}>
      <button
        data-menu-active={showMenu}
        onClick={toggleMenu}
        title={title}
        type='button'
      >
        {buttonIcon}
      </button>
      {showMenu && <ul className='top-bar-menu__items'>{children}</ul>}
    </span>
  );
}

TopBarMenu.propTypes = {
  buttonIcon: PropTypes.node.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  title: PropTypes.string,
};

/** @param {{ children: React.ReactNode }} */
function Item({ children }) {
  return <li className='top-bar-menu__item'>{children}</li>;
}

Item.propTypes = {
  children: PropTypes.node,
};

TopBarMenu.Item = Item;
export default TopBarMenu;
