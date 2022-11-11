import React from 'react';
import PropTypes from 'prop-types';
import './GWASCovariates.css';
import Covariates from './Utils/Covariates';

const ContinuousCovariates = ({
  setMode,
  sourceId,
  // searchTerm,
  selected,
  handleSubmit,
  handleSelect
}) => (
  <React.Fragment>
    <Covariates
      selectedCovariate={selected}
      handleSelect={handleSelect}
      sourceId={sourceId}
    // searchTerm={searchTerm}
    />
    <button
      type='button'
      style={{ marginLeft: 5 }}
      onClick={() => {
        handleSubmit(selected)
        setMode('')
      }}>
      Submit
    </button>
    <button
      type='button'
      onClick={() => {
        handleSubmit(undefined);
        setMode(undefined);
      }}
    >cancel
    </button>
  </React.Fragment>
);

ContinuousCovariates.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  setMode: PropTypes.func.isRequired,
  sourceId: PropTypes.number.isRequired,
  handleSelect: PropTypes.func.isRequired
  // searchTerm: PropTypes.string.isRequired
};

ContinuousCovariates.defaultProps = {
  selectedCovariate: undefined,
};

export default ContinuousCovariates;
