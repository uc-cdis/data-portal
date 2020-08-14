import React from 'react';
import PropTypes from 'prop-types';

const SurvivalPlot = ({ className }) => {
  return (
    <div className={className}>
      <h1>survival plot here</h1>
    </div>
  );
};

SurvivalPlot.propTypes = {
  className: PropTypes.string,
};

export default SurvivalPlot;
