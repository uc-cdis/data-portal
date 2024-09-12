import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';


const AttritionTableModal = ({
  selectedCohort, outcome, covariates, tableType,
}) => {

  return (
    <div>
        <Modal />
    </div>
  );
};

AttritionTable.propTypes = {
  selectedCohort: PropTypes.object,
  outcome: PropTypes.object,
  covariates: PropTypes.array,
  tableType: PropTypes.string.isRequired,
};

AttritionTable.defaultProps = {
  selectedCohort: undefined,
  outcome: null,
  covariates: [],
};

export default AttritionTable;
