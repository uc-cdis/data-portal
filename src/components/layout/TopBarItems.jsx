import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './TopBarItems.css';

/** @param {string[]} args */
function joinClassNames(...args) {
  return args.filter(Boolean).join(' ');
}

/**
 * @typedef {Object} TopBarButtonProps
 * @property {string} [className]
 * @property {React.ReactNode} [icon]
 * @property {boolean} [isActive]
 * @property {string} [name]
 * @property {React.MouseEventHandler<HTMLButtonElement>} onClick
 */

/** @param {TopBarButtonProps} props */
export function TopBarButton({
  className,
  icon,
  isActive = false,
  name,
  onClick,
}) {
  const baseClassName = isActive
    ? 'top-bar-item top-bar-item--active'
    : 'top-bar-item';

  return (
    <button
      className={joinClassNames(baseClassName, className)}
      onClick={onClick}
      type='button'
    >
      <span className='top-bar-item__content body-typo'>
        {name}
        {icon}
      </span>
    </button>
  );
}

TopBarButton.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.node,
  isActive: PropTypes.bool,
  name: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

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
