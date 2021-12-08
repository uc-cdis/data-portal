import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './TopBarItems.css';

/**
 * @typedef {Object} TopBarButtonProps
 * @property {string} [icon]
 * @property {boolean} [isActive]
 * @property {string} name
 * @property {React.MouseEventHandler<HTMLButtonElement>} onClick
 */

/** @param {TopBarButtonProps} props */
export function TopBarButton({ icon, isActive = false, name, onClick }) {
  const className = isActive
    ? 'top-bar-item top-bar-item--active'
    : 'top-bar-item';

  return (
    <button className={className} onClick={onClick} type='button'>
      <span className='top-bar-item__content body-typo'>
        {name}
        {icon && <i className={`g3-icon g3-icon--${icon}`} />}
      </span>
    </button>
  );
}

TopBarButton.propTypes = {
  icon: PropTypes.string,
  isActive: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

/**
 * @typedef {Object} TopBarLinkProps
 * @property {string} [icon]
 * @property {boolean} [isActive]
 * @property {string} name
 * @property {string} to
 */

/** @param {TopBarLinkProps} props */
export function TopBarLink({ icon, isActive = false, name, to }) {
  const className = isActive
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
      className={className}
      target='_blank'
      rel='noopener noreferrer'
      href={to}
    >
      {content}
    </a>
  ) : (
    <Link className={className} to={to}>
      {content}
    </Link>
  );
}

TopBarLink.propTypes = {
  icon: PropTypes.string,
  isActive: PropTypes.bool,
  name: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};
