import React from 'react';
import PropTypes from 'prop-types';
import './GWASCovariates.css';
import Covariates from './Utils/Covariates';

const ContinuousCovariates = ({
  setMode,
  sourceId,
  // searchTerm,
  selectedCovariate,
  handleCovariateSubmit,
}) => (
  <React.Fragment>
    <Covariates
      selectedCovariate={selectedCovariate}
      handleCovariateSelect={handleCovariateSubmit}
      sourceId={sourceId}
      // searchTerm={searchTerm}
    />
    <button type='button' style={{ marginLeft: 5 }} onClick={() => setMode('')}>Submit</button>
    <button
      type='button'
      onClick={() => {
        handleCovariateSubmit(undefined);
        setMode('');
      }}
    >cancel
    </button>
  </React.Fragment>
);

ContinuousCovariates.propTypes = {
  handleCovariateSubmit: PropTypes.func.isRequired,
  setMode: PropTypes.func.isRequired,
  sourceId: PropTypes.number.isRequired,
  selectedCovariate: PropTypes.object,
  // searchTerm: PropTypes.string.isRequired
};

ContinuousCovariates.defaultProps = {
  selectedCovariate: undefined,
};

export default ContinuousCovariates;
