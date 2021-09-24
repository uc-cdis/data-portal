import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './TopIconButton.css';

/**
 * @typedef {Object} TopLogoutButtonProps
 * @property {React.MouseEventHandler<HTMLButtonElement>} onClick
 */

/** @param {TopLogoutButtonProps} props */
export function TopLogoutButton({ onClick }) {
  return (
    <button
      className='top-icon-button top-icon-button--logout'
      aria-label='Logout button'
      onClick={onClick}
      type='button'
    >
      <span className='top-icon-button__content body-typo'>
        Logout&nbsp;
        <i className='g3-icon g3-icon--exit top-icon-button__icon' />
      </span>
    </button>
  );
}

TopLogoutButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

/**
 * @typedef {Object} TopIconButtonProps
 * @property {string} [icon]
 * @property {boolean} [isActive]
 * @property {string} name
 * @property {string} to
 */

/** @param {TopIconButtonProps} props */
function TopIconButton({ icon, isActive = false, name, to }) {
  const buttonClassName = isActive
    ? 'top-icon-button top-icon-buton--active'
    : 'top-icon-button';
  const buttonContent = (
    <span className='top-icon-button__content body-typo'>
      {name}&nbsp;
      {icon && (
        <i className={`g3-icon g3-icon--${icon} top-icon-button__icon`} />
      )}
    </span>
  );

  return to.startsWith('http') ? (
    <a
      className={buttonClassName}
      target='_blank'
      rel='noopener noreferrer'
      href={to}
    >
      {buttonContent}
    </a>
  ) : (
    <Link className={buttonClassName} to={to}>
      {buttonContent}
    </Link>
  );
}

TopIconButton.propTypes = {
  icon: PropTypes.string,
  isActive: PropTypes.bool,
  name: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export default TopIconButton;
