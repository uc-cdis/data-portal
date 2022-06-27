import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useLatestDocuments from '../../hooks/useDocumentItems';
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
 * @property {{ items: TopBarItem[] }} config
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

  const documents = useLatestDocuments();

  return (
    <nav className='top-bar' aria-label='Top Navigation'>
      <div className='top-bar__items'>
        <div>
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
        <div>
          {rightItems.map((item) => (
            <TopBarLink
              key={item.link}
              name={item.name}
              icon={item.icon}
              isActive={location.pathname === item.link}
              to={item.link}
            />
          ))}
        </div>
      </div>
      <div className='top-bar__menu-group'>
        {(documents.data?.length > 0 || documents.isError) && (
          <TopBarMenu
            buttonIcon={<FontAwesomeIcon icon='circle-question' />}
            title='Documents'
          >
            {documents.isError ? (
              <>
                <TopBarMenu.Item>
                  <small>
                    <FontAwesomeIcon
                      icon='triangle-exclamation'
                      color='var(--g3-primary-btn__bg-color)'
                    />{' '}
                    Error in fetching documents...
                  </small>
                </TopBarMenu.Item>
                <TopBarMenu.Item>
                  <button onClick={documents.refresh} type='button'>
                    Refresh documents
                  </button>
                </TopBarMenu.Item>
              </>
            ) : (
              documents.data.map((item) => (
                <TopBarMenu.Item key={item.formatted}>
                  <a
                    href={item.formatted}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {item.name}
                    <i className='g3-icon g3-icon--external-link' />
                  </a>
                </TopBarMenu.Item>
              ))
            )}
          </TopBarMenu>
        )}
        {(location.pathname !== '/login' || username !== undefined) && (
          <TopBarMenu
            buttonIcon={<FontAwesomeIcon icon='circle-user' />}
            title='Profile'
          >
            {username === undefined ? (
              <TopBarMenu.Item>
                <Link to='/login'>
                  Login <i className='g3-icon g3-icon--exit' />
                </Link>
              </TopBarMenu.Item>
            ) : (
              <>
                <TopBarMenu.Item>
                  <span>{username}</span>
                </TopBarMenu.Item>
                <hr />
                <TopBarMenu.Item>
                  <Link to='/identity'>View Profile</Link>
                </TopBarMenu.Item>
                <TopBarMenu.Item>
                  <Link to='/requests'>Data Requests</Link>
                </TopBarMenu.Item>
                {isAdminUser && (
                  <TopBarMenu.Item>
                    <Link to='/submission'>Data Submission</Link>
                  </TopBarMenu.Item>
                )}
                <hr />
                <TopBarMenu.Item>
                  <button onClick={onLogoutClick} type='button'>
                    Logout <i className='g3-icon g3-icon--exit' />
                  </button>
                </TopBarMenu.Item>
              </>
            )}
          </TopBarMenu>
        )}
      </div>
    </nav>
  );
}

TopBar.propTypes = {
  config: PropTypes.exact({
    items: PropTypes.array.isRequired,
  }).isRequired,
  isAdminUser: PropTypes.bool.isRequired,
  onLogoutClick: PropTypes.func.isRequired,
  username: PropTypes.string,
};

export default TopBar;
