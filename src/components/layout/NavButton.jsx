import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import IconComponent from '../Icon';
import './NavButton.css';

/**
 * @typedef {Object} NavButtonProps
 * @property {{ [iconName: string]: (height: string, style: Object) => JSX.Element }} dictIcons
 * @property {string} icon
 * @property {boolean} [isActive]
 * @property {string} name
 * @property {string} to
 */

/** @param {NavButtonProps} props */
function NavButton({ dictIcons, icon, isActive = false, name, to }) {
  const buttonClassName = isActive
    ? 'body-typo nav-button--active nav-button'
    : 'body-typo nav-button';
  const buttonBody = (
    <>
      <div className='nav-button__icon'>
        <IconComponent iconName={icon} dictIcons={dictIcons} />
      </div>
      {name}
    </>
  );

  return to.startsWith('http') ? (
    <a className={buttonClassName} href={to}>
      {buttonBody}
    </a>
  ) : (
    <Link className={buttonClassName} to={to}>
      {buttonBody}
    </Link>
  );
}

NavButton.propTypes = {
  dictIcons: PropTypes.objectOf(PropTypes.func).isRequired,
  icon: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  name: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export default NavButton;
