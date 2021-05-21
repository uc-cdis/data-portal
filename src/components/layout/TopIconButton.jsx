import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './TopIconButton.css';

/**
 * @param {Object} props
 * @param {string} props.name
 * @param {string} props.to
 * @param {string} [props.icon]
 * @param {boolean} [props.isActive]
 */
function TopIconButton({ name, to, icon, isActive = false }) {
  const buttonClassName = isActive
    ? 'top-icon-button button-top-active'
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
  name: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  icon: PropTypes.string,
  isActive: PropTypes.bool,
};

export default TopIconButton;
