import React from 'react';
import PropTypes from 'prop-types';

const RiskTable = ({ className }) => {
  return (
    <div className={className}>
      <h1>risk table here</h1>
    </div>
  );
};

RiskTable.propTypes = {
  className: PropTypes.string,
};

export default RiskTable;
