import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import ContinuousCovariates from '../../Components/Covariates/ContinuousCovariates';
import CustomDichotomousCovariates from '../../Components/Covariates/CustomDichotomousCovariates';
import ACTIONS from '../../Shared/StateManagement/Actions';

const SelectOutcome = ({ dispatch, studyPopulationCohort, outcome }) => {
  const [selectionMode, setSelectionMode] = useState('');

  const determineSelectOutcomeJsx = () => {
    if (selectionMode === 'continuous') {
      return (
        <ContinuousCovariates
          handleClose={() => {
            setSelectionMode('');
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
    if (selectionMode === 'dichotomous') {
      return (
        <CustomDichotomousCovariates
          studyPopulationCohort={studyPopulationCohort}
          outcome={outcome}
          handleClose={() => {
            setSelectionMode('');
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
          onClick={() => setSelectionMode('continuous')}
        >
          Add Continuous Outcome Phenotype
        </button>
        <button
          type='button'
          style={{ height: 60, marginRight: 5 }}
          onClick={() => setSelectionMode('dichotomous')}
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
  studyPopulationCohort: PropTypes.object.isRequired,
  outcome: PropTypes.object,
};

SelectOutcome.defaultProps = {
  outcome: null,
};

export default SelectOutcome;
