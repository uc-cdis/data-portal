import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import ContinuousCovariates from '../Shared/Covariates/ContinuousCovariates';
import CustomDichotomousCovariates from '../Shared/Covariates/CustomDichotomousCovariates';

const SelectOutcome = ({ covariates, dispatch, outcome }) => {
  const [mode, setMode] = useState('');
  const [selectedOutcome, setSelectedOutcome] = useState({});

  const determineSelectOutcomeJsx = () => {
    if (mode === 'continuous') {
      return (
        <ContinuousCovariates
          setMode={setMode}
          selected={selectedOutcome}
          dispatch={dispatch}
          handleSelect={setSelectedOutcome}
          covariates={covariates}
          outcome={outcome}
          type={'outcome'}
        />
      );
    } if (mode === 'dichotomous') {
      return (
        <CustomDichotomousCovariates
          setMode={setMode}
          dispatch={dispatch}
          covariates={covariates}
          outcome={outcome}
          type={'outcome'}
        />
      );
    }
    return (
      <div>
        <button
          type='button'
          style={{ height: 60, marginRight: 5 }}
          onClick={() => setMode('continuous')}
        >
            Add Continuous Outcome Phenotype
        </button>
        <button
          type='button'
          style={{ height: 60, marginRight: 5 }}
          onClick={() => setMode('dichotomous')}
        >
            Add Dichotomous Outcome Phenotype
        </button>
      </div>
    );
  };

  // Outputs the JSX for the component:
  return <div>{determineSelectOutcomeJsx()}</div>;
};

SelectOutcome.propTypes = {
  dispatch: PropTypes.func.isRequired,
  covariates: PropTypes.array.isRequired,
  outcome: PropTypes.object,
};

SelectOutcome.defaultProps = {
  outcome: null,
};

export default SelectOutcome;
