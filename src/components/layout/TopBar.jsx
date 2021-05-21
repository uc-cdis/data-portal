import React from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import TopIconButton from './TopIconButton';
import './TopBar.css';

/**
 * NavBar renders row of nav-items of form { name, icon, link }
 * @param {Object} props
 * @param {{ name: string; link: string; icon?: string; }[]} props.topItems
 * @param {string} props.username
 * @param {boolean} props.isAdminUser
 * @param {() => void} props.onLogoutClick
 */
function TopBar({ topItems, username, isAdminUser, onLogoutClick }) {
  const location = useLocation();

  return (
    <header className='top-bar'>
      <nav className='top-bar__nav'>
        <div className='top-bar__nav--hidden-lg-and-down'>
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
        <div className='top-bar__nav--flex-center'>
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
              <TopIconButton
                icon='exit'
                name='Logout'
                to='#'
                onClick={onLogoutClick}
              />
            </>
          ) : (
            <TopIconButton icon='exit' name='Login' to='/login' />
          )}
        </div>
      </nav>
    </header>
  );
}

TopBar.propTypes = {
  topItems: PropTypes.array.isRequired,
  username: PropTypes.string,
  isAdminUser: PropTypes.bool,
  onLogoutClick: PropTypes.func.isRequired,
};

export default TopBar;
