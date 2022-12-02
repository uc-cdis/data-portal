import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import ContinuousCovariates from '../../Components/Covariates/ContinuousCovariates';
import CustomDichotomousCovariates from '../../Components/Covariates/CustomDichotomousCovariates';
import ACTIONS from '../../Shared/StateManagement/Actions';

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
    }
    if (mode === 'dichotomous') {
      return (
        <CustomDichotomousCovariates
          handleClose={() => {
            setMode('');
          }}
          dispatch={(selectedOutcome) => {
            dispatch({
              type: ACTIONS.SET_OUTCOME,
              payload: selectedOutcome,
            });
          }}
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
