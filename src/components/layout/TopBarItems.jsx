/* eslint-disable import/prefer-default-export */
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './TopBarItems.css';

/** @param {string[]} args */
function joinClassNames(...args) {
  return args.filter(Boolean).join(' ');
}

/**
 * @typedef {Object} TopBarLinkProps
 * @property {string} [className]
 * @property {string} [icon]
 * @property {boolean} [isActive]
 * @property {string} name
 * @property {string} to
 */

/** @param {TopBarLinkProps} props */
export function TopBarLink({ className, icon, isActive = false, name, to }) {
  const baseClassName = isActive
    ? 'top-bar-item top-icon-buton--active'
    : 'top-bar-item';
  const content = (
    <span className='top-bar-item__content body-typo'>
      {name}
      {icon && <i className={`g3-icon g3-icon--${icon}`} />}
    </span>
  );

  return to.startsWith('http') ? (
    <a
      className={joinClassNames(baseClassName, className)}
      target='_blank'
      rel='noopener noreferrer'
      href={to}
    >
      {content}
    </a>
  ) : (
    <Link className={joinClassNames(baseClassName, className)} to={to}>
      {content}
    </Link>
  );
}

TopBarLink.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
  isActive: PropTypes.bool,
  name: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};
