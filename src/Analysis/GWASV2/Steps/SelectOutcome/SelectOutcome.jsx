import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import ContinuousCovariates from '../../Components/Covariates/ContinuousCovariates';
import CustomDichotomousCovariates from '../../Components/Covariates/CustomDichotomousCovariates';
import ACTIONS from '../../Utils/StateManagement/Actions';

const SelectOutcome = ({ dispatch, studyPopulationCohort, outcome }) => {
  const [selectionMode, setSelectionMode] = useState('');

  const determineSelectOutcomeJsx = () => {
    if (selectionMode === 'continuous') {
      return (
        <ContinuousCovariates
          selectedStudyPopulationCohort={studyPopulationCohort}
          selectedCovariates={[]} // TODO - add to props above as well and pass in here...
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
      <div className='GWASUI-selectionUI'>
        <button type='button' onClick={() => setSelectionMode('continuous')}>
          <span>+</span>
          <span>Add Continuous Outcome Phenotype</span>
        </button>
        <button type='button' onClick={() => setSelectionMode('dichotomous')}>
          <span>+</span>
          <span>Add Dichotomous Outcome Phenotype</span>
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
