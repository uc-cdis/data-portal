import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import ContinuousCovariates from '../../Components/Covariates/ContinuousCovariates';
import CustomDichotomousCovariates from '../../Components/Covariates/CustomDichotomousCovariates';
import ACTIONS from '../../Shared/StateManagement/Actions';

const SelectOutcome = ({ covariates, dispatch, outcome }) => {
  const [outcomeSelectionMode, setOutcomeSelectionMode] = useState('');

  const determineSelectOutcomeJsx = () => {
    if (outcomeSelectionMode === 'continuous') {
      return (
        <ContinuousCovariates
          handleClose={() => {
            setOutcomeSelectionMode('');
          }}
          dispatch={(chosenOutcome) => {
            dispatch({
              type: ACTIONS.SET_OUTCOME,
              payload: chosenOutcome,
            });
          }}
        />
      );
    }
    if (outcomeSelectionMode === 'dichotomous') {
      return (
        <CustomDichotomousCovariates
          handleClose={() => {
            setOutcomeSelectionMode('');
          }}
          dispatch={(chosenOutcome) => {
            dispatch({
              type: ACTIONS.SET_OUTCOME,
              payload: chosenOutcome,
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
          onClick={() => setOutcomeSelectionMode('continuous')}
        >
          Add Continuous Outcome Phenotype
        </button>
        <button
          type='button'
          style={{ height: 60, marginRight: 5 }}
          onClick={() => setOutcomeSelectionMode('dichotomous')}
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
