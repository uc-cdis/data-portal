import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import ContinuousCovariates from '../../Components/Covariates/ContinuousCovariates';
import CustomDichotomousCovariates from '../../Components/Covariates/CustomDichotomousCovariates';
import ACTIONS from '../../Shared/StateManagement/Actions';

const SelectCovariates = ({ dispatch, outcome }) => {
  const [mode, setMode] = useState('');

  return (
    <React.Fragment>
      {mode === 'continuous' && (
        <ContinuousCovariates
          handleClose={() => {
            setMode('');
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

      {mode === 'dichotomous' && (
        <CustomDichotomousCovariates
          handleClose={() => {
            setMode('');
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
      {!mode && (
        <div>
          <button
            type='button'
            style={{
              height: 60,
              marginRight: 5,
            }}
            onClick={() => setMode('continuous')}
          >
            Add Continuous Outcome Covariate
          </button>
          <button
            type='button'
            style={{
              height: 60,
              marginLeft: 5,
            }}
            onClick={() => setMode('dichotomous')}
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
  outcome: PropTypes.object.isRequired,
};

export default SelectCovariates;
