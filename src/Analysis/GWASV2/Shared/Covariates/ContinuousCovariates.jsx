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
  allCovariates = [],
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
        : { set: "allCovariates", update: [...allCovariates, selected] }
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
  allCovariates: PropTypes.array
  // searchTerm: PropTypes.string.isRequired
};

ContinuousCovariates.defaultProps = {
  selectedCovariate: undefined,
  allCovariates: []
};

export default ContinuousCovariates;
