import React from 'react';
import PropTypes from 'prop-types';
import './Toaster.css';

class Toaster extends React.Component {
  render() {
    return this.props.isEnabled
      ? (
        <div className={`${this.props.className} toaster__div`}>
          {this.props.children}
        </div>
      )
      : null;
  }
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
