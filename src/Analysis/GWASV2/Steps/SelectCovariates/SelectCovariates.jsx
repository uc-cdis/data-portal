import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import ContinuousCovariates from '../../Components/Covariates/ContinuousCovariates';
import CustomDichotomousCovariates from '../../Components/Covariates/CustomDichotomousCovariates';
import ACTIONS from '../../Shared/StateManagement/Actions';

const SelectCovariates = ({
  dispatch,
  studyPopulationCohort,
  outcome,
  covariates,
}) => {
  const [selectionMode, setSelectionMode] = useState('');

  return (
    <React.Fragment>
      {selectionMode === 'continuous' && (
        <ContinuousCovariates
          covariates={covariates}
          outcome={outcome}
          handleClose={() => {
            setSelectionMode('');
          }}
          dispatch={(chosenOutcome) => {
            dispatch({
              type: ACTIONS.ADD_COVARIATE,
              payload: chosenOutcome,
            });
          }}
          submitButtonLabel={'Add'}
        />
      )}

      {selectionMode === 'dichotomous' && (
        <CustomDichotomousCovariates
          studyPopulationCohort={studyPopulationCohort}
          covariates={covariates}
          outcome={outcome}
          handleClose={() => {
            setSelectionMode('');
          }}
          dispatch={(chosenCovariate) => {
            dispatch({
              type: ACTIONS.ADD_COVARIATE,
              payload: chosenCovariate,
            });
          }}
          submitButtonLabel={'Add'}
        />
      )}
      {!selectionMode && (
        <div>
          <button
            type='button'
            style={{
              height: 60,
              marginRight: 5,
            }}
            onClick={() => setSelectionMode('continuous')}
          >
            Add Continuous Outcome Covariate
          </button>
          <button
            type='button'
            style={{
              height: 60,
              marginLeft: 5,
            }}
            onClick={() => setSelectionMode('dichotomous')}
          >
            Add Dichotomous Outcome Covariate
          </button>
        </div>
      )}
    </React.Fragment>
  );
};

SelectCovariates.propTypes = {
  dispatch: PropTypes.func.isRequired,
  studyPopulationCohort: PropTypes.object.isRequired,
  outcome: PropTypes.object.isRequired,
  covariates: PropTypes.array.isRequired,
};

export default SelectCovariates;
