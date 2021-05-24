import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import IconComponent from '../Icon';
import './NavButton.css';

/**
 * @param {Object} props
 * @param {{ [iconName: string]: (height: string, svgStyles: Object) => SVGElement }} props.dictIcons
 * @param {string} props.icon
 * @param {string} props.name
 * @param {string} props.to
 * @param {boolean} [props.isActive]
 */
function NavButton({ dictIcons, icon, name, to, isActive = false }) {
  const buttonClassName = isActive
    ? 'body-typo button-active nav-button'
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
  dictIcons: PropTypes.object.isRequired,
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
};

export default NavButton;
