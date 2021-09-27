import React from 'react';
import PropTypes from 'prop-types';
import './Toaster.css';

/**
 * @typedef {Object} ToasterProps
 * @property {React.ReactNode} children
 * @property {string} [className]
 * @property {boolean} isEnabled
 */

/** @param {ToasterProps} props */
function Toaster({ children, className = '', isEnabled }) {
  return isEnabled ? (
    <div className={`${className} toaster__div`.trim()}>{children}</div>
  ) : null;
}

Toaster.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  className: PropTypes.string,
  isEnabled: PropTypes.bool.isRequired,
};

export default Toaster;
