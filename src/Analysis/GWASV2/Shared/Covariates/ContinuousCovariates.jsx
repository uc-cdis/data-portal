import React from 'react';
import PropTypes from 'prop-types';
// import './GWASCovariates.css';
import Covariates from './Covariates';

const ContinuousCovariates = ({
  setMode,
  // searchTerm,
  selected,
  dispatch,
  handleSelect,
  covariates = [],
  outcome,
  type,
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
        dispatch(
          type === 'outcome'
            ? { keyName: ['outcome', 'current'], newValue: [selected, 2] }
            : { keyName: 'covariates', newValue: selected, op: '+' }
        );
        setMode('');
      }}
    >
      Submit
    </button>
    <button
      type='button'
      onClick={() => {
        setMode(undefined);
      }}
    >
      cancel
    </button>
  </React.Fragment>
);

ContinuousCovariates.propTypes = {
  dispatch: PropTypes.func.isRequired,
  setMode: PropTypes.func.isRequired,
  handleSelect: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  covariates: PropTypes.array,
  outcome: PropTypes.object.isRequired,
};

ContinuousCovariates.defaultProps = {
  selectedCovariate: undefined,
  covariates: [],
};

export default ContinuousCovariates;
