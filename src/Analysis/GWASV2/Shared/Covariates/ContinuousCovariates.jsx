import React from 'react';
import PropTypes from 'prop-types';
// import './GWASCovariates.css';
import Covariates from './Covariates';

const ContinuousCovariates = ({
  setMode,
  // searchTerm,
  selected,
  handleSubmit,
  handleSelect,
  type
}) => (
  <React.Fragment>
    <Covariates
      selected={selected}
      handleSelect={handleSelect}
    // searchTerm={searchTerm}
    />
    <button
      type='button'
      style={{ marginLeft: 5 }}
      onClick={() => {
        handleSubmit({ set: ["outcome", "current"], update: [selected, 2]  })
        setMode('')
      }}>
      Submit
    </button>
    <button
      type='button'
      onClick={() => {
        // handleSubmit(undefined);
        setMode(undefined);
      }}
    >cancel
    </button>
  </React.Fragment>
);

ContinuousCovariates.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  setMode: PropTypes.func.isRequired,
  handleSelect: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
  // searchTerm: PropTypes.string.isRequired
};

ContinuousCovariates.defaultProps = {
  selectedCovariate: undefined,
};

export default ContinuousCovariates;
