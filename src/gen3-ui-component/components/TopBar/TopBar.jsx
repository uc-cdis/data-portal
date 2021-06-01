import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import TopBarButton from './TopBarButton';
import './TopBar.css';

function TopBar({ tabItems, user, activeTab, onActiveTab, onLogout }) {
  function isActive(id) {
    return activeTab === id;
  }

  return (
    <div className='top-bar'>
      <header className='top-bar__header'>
        <nav className='top-bar__nav'>
          {tabItems.map((item, i) =>
            item.link.startsWith('http') ? (
              <a
                className='top-bar__link'
                key={item.link}
                href={item.link}
                target='_blank'
                rel='noopener noreferrer'
              >
                <TopBarButton
                  item={item}
                  isActive={isActive(item.link)}
                  onActiveTab={() => onActiveTab(item.link)}
                  tabIndex={i}
                />
              </a>
            ) : (
              <Link className='top-bar__link' key={item.link} to={item.link}>
                <TopBarButton
                  item={item}
                  isActive={isActive(item.link)}
                  onActiveTab={() => onActiveTab(item.link)}
                  tabIndex={i}
                />
              </Link>
            )
          )}
          {user.username !== undefined && (
            <button className='top-bar__link' onClick={onLogout} type='button'>
              <TopBarButton
                item={{
                  name: user.username,
                  iconClassName: 'g3-icon g3-icon--exit',
                }}
                tabIndex={tabItems.length}
              />
            </button>
          )}
        </nav>
      </header>
    </div>
  );
}

TopBar.propTypes = {
  tabItems: PropTypes.array.isRequired,
  user: PropTypes.shape({ username: PropTypes.string }).isRequired,
  activeTab: PropTypes.string,
  onActiveTab: PropTypes.func,
  onLogout: PropTypes.func.isRequired,
};

TopBar.defaultProps = {
  activeTab: '',
  onActiveTab: () => {},
};

export default TopBar;
