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
  covariates = [],
  outcome,
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
        handleSubmit(type === "outcome" ?
        { set: ["outcome", "current"], update: [selected, 2] }
        : { set: "covariates", update: selected, op: "+" }
        )
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
  type: PropTypes.string.isRequired,
  covariates: PropTypes.array,
  outcome: PropTypes.object.isRequired
  // searchTerm: PropTypes.string.isRequired
};

ContinuousCovariates.defaultProps = {
  selectedCovariate: undefined,
  covariates: []
};

export default ContinuousCovariates;
