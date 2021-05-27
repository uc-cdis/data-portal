import React from 'react';
import PropTypes from 'prop-types';
import './Toaster.css';

function Toaster({ isEnabled, className, children }) {
  return isEnabled ? (
    <div className={`${className} toaster__div`}>{children}</div>
  ) : null;
}

Toaster.propTypes = {
  isEnabled: PropTypes.bool.isRequired,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

Toaster.defaultProps = {
  className: '',
};

export default Toaster;
