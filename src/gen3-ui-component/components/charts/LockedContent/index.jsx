import React from 'react';
import PropTypes from 'prop-types';
import './LockedContent.css';

class LockedContent extends React.Component {
  render() {
    return (
      <div className='locked-content__lock-div'>
        <i className='g3-icon g3-icon--lock' />
        <p>{this.props.lockMessage}</p>
      </div>
    );
  }
}

LockedContent.propTypes = {
  lockMessage: PropTypes.string.isRequired,
};

export default LockedContent;
