import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TopBarLink } from './TopBarItems';
import TopBarMenu from './TopBarMenu';
import './TopBar.css';

/**
 * @typedef {Object} TopBarItem
 * @property {string} name
 * @property {boolean} [leftOrientation]
 * @property {string} link
 * @property {string} [icon]
 */

/**
 * NavBar renders row of nav-items of form { name, icon, link }
 * @typedef {Object} TopBarProps
 * @property {{ items: TopBarItem[]; menuItems: TopBarItem[] }} config
 * @property {boolean} isAdminUser
 * @property {React.MouseEventHandler<HTMLButtonElement>} onLogoutClick
 * @property {string} [username]
 */

/** @param {TopBarProps} props */
function TopBar({ config, isAdminUser, onLogoutClick, username }) {
  const location = useLocation();
  const leftItems = [];
  const rightItems = [];
  for (const item of config.items)
    if (item.leftOrientation) leftItems.push(item);
    else rightItems.push(item);

  return (
    <nav className='top-bar' aria-label='Top Navigation'>
      <div className='top-bar--hidden-lg-and-down'>
        {leftItems.map((item) => (
          <TopBarLink
            key={item.link}
            name={item.name}
            icon={item.icon}
            isActive={location.pathname === item.link}
            to={item.link}
          />
        ))}
      </div>
      <div className='top-bar--flex-center'>
        {rightItems.map(
          (item) =>
            (item.link !== '/submission' || isAdminUser) && (
              <TopBarLink
                key={item.link}
                name={item.name}
                icon={item.icon}
                isActive={location.pathname === item.link}
                to={item.link}
              />
            )
        )}
        {username !== undefined ? (
          <TopBarMenu
            items={config.menuItems}
            onLogoutClick={onLogoutClick}
            username={username}
          />
        ) : (
          location.pathname !== '/login' && (
            <TopBarLink icon='exit' name='Login' to='/login' />
          )
        )}
      </div>
    </nav>
  );
}

TopBar.propTypes = {
  config: PropTypes.exact({
    items: PropTypes.array.isRequired,
    menuItems: PropTypes.array.isRequired,
  }).isRequired,
  isAdminUser: PropTypes.bool.isRequired,
  onLogoutClick: PropTypes.func.isRequired,
  username: PropTypes.string,
};

export default TopBar;
