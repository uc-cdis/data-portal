import { useState } from 'react';
import PropTypes from 'prop-types';
import { TopBarButton } from './TopBarItems';
import './TopBarMenu.css';

/**
 * @param {Object} props
 * @param {Object} props.buttonProps
 * @param {Object} props.buttonProps.icon
 * @param {Object} [props.buttonProps.name]
 * @param {React.ReactNode[]} props.children
 */
function TopBarMenu({ buttonProps, children }) {
  const [showMenu, setShowMenu] = useState(false);
  function handleMenuBlur(e) {
    if (showMenu && !e.currentTarget.contains(e.relatedTarget))
      setShowMenu(false);
  }
  function toggleMenu() {
    setShowMenu((s) => !s);
  }
  return (
    <span onBlur={handleMenuBlur}>
      <TopBarButton
        isActive={showMenu}
        icon={buttonProps.icon}
        name={buttonProps.name}
        onClick={toggleMenu}
      />
      {showMenu && <ul className='top-bar-menu__items'>{children}</ul>}
    </span>
  );
}

TopBarMenu.propTypes = {
  buttonProps: PropTypes.exact({
    icon: PropTypes.string,
    name: PropTypes.string,
  }),
  children: PropTypes.arrayOf(PropTypes.node),
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
