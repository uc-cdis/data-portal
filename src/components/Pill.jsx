import PropTypes from 'prop-types';
import './Pill.css';

/**
 * @param {Object} props
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 * @param {string} [props.filterKey]
 * @param {React.EventHandler<any>} [props.onClick]
 * @param {React.EventHandler<any>} [props.onClose]
 */
export default function Pill({ className = 'pill', children, filterKey, onClick, onClose }) {
  return (
    <div className='pill-container'>
      {typeof onClick === 'function' ? (
        <button
          className={className}
          type='button'
          onClick={onClick}
          filter-key={filterKey}
        >
          {children}
        </button>
      ) : (
        <span className={className}>{children}</span>
      )}
      {typeof onClose === 'function' ? (
        <button
          className='pill close'
          type='button'
          onClick={onClose}
          filter-key={filterKey}
        >
          <i className='g3-icon g3-icon--cross g3-icon--sm' />
        </button>
      ) : null}
    </div>
  );
}

Pill.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  filterKey: PropTypes.string,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
};
