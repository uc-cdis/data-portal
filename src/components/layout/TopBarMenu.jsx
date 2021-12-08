import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { TopBarButton } from './TopBarItems';
import './TopBarMenu.css';

/**
 * @param {Object} props
 * @param {{ icon?: string; link: string; name: string; }[]} [props.items]
 * @param {React.MouseEventHandler<HTMLButtonElement>} props.onLogoutClick
 * @param {string} props.username
 */
function TopBarMenu({ items, onLogoutClick, username }) {
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
        icon='user-circle'
        name={username}
        onClick={toggleMenu}
      />
      {showMenu && (
        <ul className='top-bar-menu__items'>
          <li className='top-bar-menu__item'>
            <Link to='/identity'>View Profile</Link>
          </li>
          {items?.map((item) => (
            <li key={item.link} className='top-bar-menu__item'>
              <a href={item.link} target='_blank' rel='noopener noreferrer'>
                {item.name}
                {item.icon && <i className={`g3-icon g3-icon--${item.icon}`} />}
              </a>
            </li>
          ))}
          <hr />
          <li className='top-bar-menu__item'>
            <button onClick={onLogoutClick} type='button'>
              Logout <i className='g3-icon g3-icon--exit' />
            </button>
          </li>
        </ul>
      )}
    </span>
  );
}

TopBarMenu.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.exact({
      icon: PropTypes.string,
      link: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  onLogoutClick: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
};

export default TopBarMenu;
