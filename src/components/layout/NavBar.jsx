import React, { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import NavButton from './NavButton';
import NavBarTooltip from './NavBarTooltip';
import { breakpoints } from '../../localconf';
import { config } from '../../params';
import './NavBar.css';

/**
 * NavBar renders row of nav-items of form { name, icon, link }
 * @param {Object} props
 * @param {{ [iconName: string]: (height: string, svgStyles: Object) => SVGElement }} props.dictIcons
 * @param {{ icon: string; link: string; name: string; tooltip?: string; }[]} props.navItems
 * @param {string} [props.navTitle]
 * @param {{ [key: string]: any; }} props.userAccess
 */
function NavBar({ navItems, userAccess, dictIcons, navTitle }) {
  const location = useLocation();
  if (location.pathname === '/login') return null;

  const navButtonRefs = {};
  for (const { link } of navItems)
    if (navButtonRefs[link] === undefined) navButtonRefs[link] = useRef();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [tooltipDetails, setTooltipDetails] = useState({ content: '' });

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

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
                src='/src/img/logo.png'
                alt='Main logo'
              />
            </a>
          ) : (
            <Link to=''>
              <img
                className='nav-bar__logo-img'
                src='/src/img/logo.png'
                alt='Main logo'
              />
            </Link>
          )}
        </div>
        {navTitle && (
          <div role='button' tabIndex={0} className='nav-bar__home-button'>
            <Link className='h3-typo nav-bar__link nav-bar__link--home' to=''>
              {navTitle}
            </Link>
          </div>
        )}
      </div>
      <MediaQuery query={`(max-width: ${breakpoints.tablet}px)`}>
        <div
          className='nav-bar__menu'
          onClick={toggleMenu}
          onKeyPress={(e) => e.key === 'Enter' && toggleMenu()}
          role='button'
          tabIndex={0}
          aria-expanded={isMenuOpen}
        >
          Menu
          <FontAwesomeIcon
            className='nav-bar__menu-icon'
            icon={isMenuOpen ? 'angle-down' : 'angle-up'}
            size='lg'
          />
        </div>
        {isMenuOpen && <div className='nav-bar__nav--items'>{navButtons}</div>}
      </MediaQuery>
      <MediaQuery query={`(min-width: ${breakpoints.tablet + 1}px)`}>
        <div className='nav-bar__nav--items'>{navButtons}</div>
        {tooltipDetails.content !== '' && <NavBarTooltip {...tooltipDetails} />}
      </MediaQuery>
    </nav>
  );
}

NavBar.propTypes = {
  dictIcons: PropTypes.object.isRequired,
  navItems: PropTypes.array.isRequired,
  navTitle: PropTypes.string,
  userAccess: PropTypes.object.isRequired,
};

export default NavBar;
