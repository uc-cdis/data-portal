import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import TopIconButton from './TopIconButton';
import './TopBar.less';
import { useArboristUI } from '../../localconf';
import { userHasMethodOnAnyProject } from '../../authMappingUtils';

/**
 * NavBar renders row of nav-items of form { name, icon, link }
 */
function TopBar({ topItems, user, userAuthMapping, onLogoutClick }) {
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
          {topItems.map((item) => {
            if (item.link === '/submission') {
              const resourcePath = '/services/sheepdog/submission/project';
              const isAdminUser =
                user.authz &&
                user.authz.hasOwnProperty(resourcePath) &&
                user.authz[resourcePath][0].method === '*';
              if (!isAdminUser) return undefined;
            }

            let buttonText = item.name;
            if (item.name === 'Submit Data' && useArboristUI) {
              if (userHasMethodOnAnyProject('create', userAuthMapping)) {
                buttonText = 'Submit/Browse Data';
              } else {
                buttonText = 'Browse Data';
              }
            }

            return item.link.startsWith('http') ? (
              <a
                className='top-bar__link'
                key={item.link}
                href={item.link}
                target='_blank'
                rel='noopener noreferrer'
              >
                <TopIconButton
                  name={buttonText}
                  icon={item.icon}
                  isActive={location.pathname === item.link}
                />
              </a>
            ) : (
              <Link className='top-bar__link' key={item.link} to={item.link}>
                <TopIconButton
                  name={buttonText}
                  icon={item.icon}
                  isActive={location.pathname === item.link}
                />
              </Link>
            );
          })}
          {user.username !== undefined ? (
            <>
              <Link className='top-bar__link' to='/identity'>
                <TopIconButton
                  icon='user-circle'
                  name={user.username}
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
  user: PropTypes.shape({ username: PropTypes.string }).isRequired,
  userAuthMapping: PropTypes.object.isRequired,
  onLogoutClick: PropTypes.func.isRequired,
};

export default TopBar;
