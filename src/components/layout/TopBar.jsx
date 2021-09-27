import React from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import TopIconButton, { TopLogoutButton } from './TopIconButton';
import './TopBar.css';

/**
 * NavBar renders row of nav-items of form { name, icon, link }
 * @typedef {Object} TopBarProps
 * @property {boolean} isAdminUser
 * @property {React.MouseEventHandler<HTMLButtonElement>} onLogoutClick
 * @property {{ name: string; link: string; icon?: string; }[]} topItems
 * @property {string} [username]
 */

/** @param {TopBarProps} props */
function TopBar({ isAdminUser, onLogoutClick, topItems, username }) {
  const location = useLocation();

  return (
    <nav className='top-bar' aria-label='Top Navigation'>
      <div className='top-bar--hidden-lg-and-down'>
        <TopIconButton
          icon='external-link'
          name='About PCDC'
          to='https://commons.cri.uchicago.edu/pcdc-consortium/'
        />
        <TopIconButton
          icon='external-link'
          name='Our Sponsors'
          to='https://commons.cri.uchicago.edu/sponsors/'
        />
      </div>
      <div className='top-bar--flex-center'>
        {topItems.map(
          (item) =>
            (item.link !== '/submission' || isAdminUser) && (
              <TopIconButton
                key={item.link}
                name={item.name}
                icon={item.icon}
                isActive={location.pathname === item.link}
                to={item.link}
              />
            )
        )}
        {username !== undefined ? (
          <>
            <TopIconButton
              icon='user-circle'
              name={username}
              isActive={location.pathname === '/identity'}
              to='/identity'
            />
            <TopLogoutButton onClick={onLogoutClick} />
          </>
        ) : (
          location.pathname !== '/login' && (
            <TopIconButton icon='exit' name='Login' to='/login' />
          )
        )}
      </div>
    </nav>
  );
}

TopBar.propTypes = {
  isAdminUser: PropTypes.bool.isRequired,
  onLogoutClick: PropTypes.func.isRequired,
  topItems: PropTypes.array.isRequired,
  username: PropTypes.string,
};

export default TopBar;
