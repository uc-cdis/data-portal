import React from 'react';
import PropTypes from 'prop-types';
import './LockedContent.css';

function LockedContent({ lockMessage }) {
  return (
    <div className='locked-content__lock-div'>
      <i className='g3-icon g3-icon--lock' />
      <p>{lockMessage}</p>
    </div>
  );
}

LockedContent.propTypes = {
  lockMessage: PropTypes.string.isRequired,
};

export default LockedContent;
