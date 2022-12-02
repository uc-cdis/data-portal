import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import ContinuousCovariates from '../../Components/Covariates/ContinuousCovariates';
import CustomDichotomousCovariates from '../../Components/Covariates/CustomDichotomousCovariates';
import ACTIONS from '../../Shared/StateManagement/Actions';

const SelectCovariates = ({ dispatch, covariates, outcome }) => {
  const [mode, setMode] = useState(undefined);
  const [selectedCovariate, setSelectedCovariate] = useState({});

  return (
    <React.Fragment>
      {mode === 'continuous' && (
        <ContinuousCovariates
          setMode={setMode}
          selected={selectedCovariate}
          dispatch={dispatch}
          handleSelect={setSelectedCovariate}
          outcome={outcome}
          type={'covariate'}
          submitButtonLabel={'Add'}
        />
      )}

      {mode === 'dichotomous' && (
        <CustomDichotomousCovariates
          handleClose={() => {
            setMode('');
          }}
          dispatch={(selectedCovariate) => {
            dispatch({
              type: ACTIONS.ADD_COVARIATE,
              payload: selectedCovariate,
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
  covariates: PropTypes.array.isRequired,
  outcome: PropTypes.object.isRequired,
};

export default SelectCovariates;
