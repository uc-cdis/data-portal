import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useResizeDetector } from 'react-resize-detector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import NavButton from './NavButton';
import NavBarTooltip from './NavBarTooltip';
import { breakpoints } from '../../localconf';
import { config } from '../../params';
import MainLogo from '../../img/logo.png';
import './NavBar.css';

/**
 * @typedef {Object} NavItem
 * @property {string} [color]
 * @property {string} icon
 * @property {string} link
 * @property {string} name
 * @property {string | null} [tooltip]
 */

/**
 * @typedef {Object} NavBarProps
 * @property {{ [iconName: string]: (height: string, style: Object) => JSX.Element }} dictIcons
 * @property {NavItem[]} navItems
 * @property {string} [navTitle]
 * @property {{ [key: string]: any }} userAccess
 * @returns
 */

/**
 * NavBar renders row of nav-items of form { name, icon, link }
 * @param {NavBarProps} props
 */
function NavBar({ dictIcons, navItems, navTitle, userAccess }) {
  const { width: screenWidth } = useResizeDetector({
    handleHeight: false,
    targetRef: useRef(document.body),
  });

  const navButtonRefs = {};
  for (const { link } of navItems)
    if (navButtonRefs[link] === undefined) navButtonRefs[link] = useRef();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [tooltipDetails, setTooltipDetails] = useState({ content: '' });

  const location = useLocation();
  if (location.pathname === '/login') return null;

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  /** @param {NavItem} item */
  function updateTooltip(item) {
    /*
    - `item.tooltip` is a string: display it on mouse hover
    - `item.tooltip` is null/empty string: no tooltip text for this button
    - `item` is null: mouse is not over a button
    */
    const newTooltipDetails = { content: '' };
    if (item?.tooltip) {
      const navButtonEl = navButtonRefs[item.link].current;
      const { x, width, bottom } = navButtonEl.getBoundingClientRect();

      newTooltipDetails.content = item.tooltip;
      newTooltipDetails.x = x + width / 2;
      newTooltipDetails.y = bottom + window.scrollY + 5;
    }
    if (newTooltipDetails.content !== tooltipDetails.content)
      setTooltipDetails(newTooltipDetails);
  }

  const navButtons = navItems.map(
    (item) =>
      (userAccess[item.name] ?? true) && (
        <div
          key={item.link}
          ref={navButtonRefs[item.link]}
          className='nav-bar__link nav-bar__link--right'
          onMouseOver={() => updateTooltip(item)}
          onMouseLeave={() => updateTooltip(null)}
          onFocus={() => updateTooltip(item)}
          onBlur={() => updateTooltip(null)}
        >
          <NavButton
            dictIcons={dictIcons}
            icon={item.icon}
            name={item.name}
            to={item.link}
            isActive={location.pathname.startsWith(item.link)}
          />
        </div>
      )
  );

  return (
    <nav className='nav-bar' aria-label='Main Navigation'>
      <div className='nav-bar__nav--info'>
        <div className='nav-bar__logo'>
          {config.homepageHref ? (
            <a href={config.homepageHref}>
              <img
                className='nav-bar__logo-img'
                src={MainLogo}
                alt='Main logo'
              />
            </a>
          ) : (
            <Link to='/'>
              <img
                className='nav-bar__logo-img'
                src={MainLogo}
                alt='Main logo'
              />
            </Link>
          )}
        </div>
        {navTitle && (
          <div className='nav-bar__home-button'>
            <Link className='h3-typo nav-bar__link nav-bar__link--home' to='/'>
              {navTitle}
            </Link>
          </div>
        )}
      </div>
      {screenWidth <= breakpoints.tablet ? (
        <>
          <div
            className='nav-bar__menu'
            onClick={toggleMenu}
            onKeyPress={(e) => {
              if (e.charCode === 13 || e.charCode === 32) {
                e.preventDefault();
                toggleMenu();
              }
            }}
            role='button'
            tabIndex={0}
            aria-expanded={isMenuOpen}
            aria-label={`${isMenuOpen ? 'Expand' : 'Collapse'} navigation menu`}
          >
            Menu
            <FontAwesomeIcon
              className='nav-bar__menu-icon'
              icon={isMenuOpen ? 'angle-down' : 'angle-up'}
              size='lg'
            />
          </div>
          {isMenuOpen && (
            <div className='nav-bar__nav--items'>{navButtons}</div>
          )}
        </>
      ) : (
        <>
          <div className='nav-bar__nav--items'>
            {navButtons}
          </div>
          {tooltipDetails.content !== '' && (
            <NavBarTooltip {...tooltipDetails} />
          )}
        </>
      )}
    </nav>
  );
}

NavBar.propTypes = {
  dictIcons: PropTypes.objectOf(PropTypes.func).isRequired,
  navItems: PropTypes.arrayOf(
    PropTypes.exact({
      icon: PropTypes.string,
      link: PropTypes.string,
      color: PropTypes.string,
      name: PropTypes.string,
      tooltip: PropTypes.string,
    })
  ).isRequired,
  navTitle: PropTypes.string,
  userAccess: PropTypes.object.isRequired,
};

export default NavBar;
