import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import TopIconButton from './TopIconButton';
import './TopBar.less';

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
          <a
            className='top-bar__link'
            href='https://commons.cri.uchicago.edu/pcdc-consortium/'
            target='_blank'
            rel='noopener noreferrer'
          >
            <TopIconButton icon='external-link' name='About PCDC' />
          </a>
          <a
            className='top-bar__link'
            href='https://commons.cri.uchicago.edu/sponsors/'
            target='_blank'
            rel='noopener noreferrer'
          >
            <TopIconButton icon='external-link' name='Our Sponsors' />
          </a>
        </div>
        <div className='top-bar__nav--flex-center'>
          {topItems.map((item) =>
            (item.link !== '/submission' || isAdminUser) &&
            item.link.startsWith('http') ? (
              <a
                className='top-bar__link'
                key={item.link}
                href={item.link}
                target='_blank'
                rel='noopener noreferrer'
              >
                <TopIconButton
                  name={item.name}
                  icon={item.icon}
                  isActive={location.pathname === item.link}
                />
              </a>
            ) : (
              <Link className='top-bar__link' key={item.link} to={item.link}>
                <TopIconButton
                  name={item.name}
                  icon={item.icon}
                  isActive={location.pathname === item.link}
                />
              </Link>
            )
          )}
          {username !== undefined ? (
            <>
              <Link className='top-bar__link' to='/identity'>
                <TopIconButton
                  icon='user-circle'
                  name={username}
                  isActive={location.pathname === '/identity'}
                />
              </Link>
              <Link className='top-bar__link' to='#' onClick={onLogoutClick}>
                <TopIconButton icon='exit' name='Logout' />
              </Link>
            </>
          ) : (
            <Link className='top-bar__link' to='/login'>
              <TopIconButton icon='exit' name='Login' />
            </Link>
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
