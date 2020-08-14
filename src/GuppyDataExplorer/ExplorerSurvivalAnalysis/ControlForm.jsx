import React from 'react';
import PropTypes from 'prop-types';

const ControlForm = ({ className }) => {
  return (
    <div className={className}>
      <h1>control form here</h1>
    </div>
  );
};

ControlForm.propTypes = {
  className: PropTypes.string,
};

export default ControlForm;
