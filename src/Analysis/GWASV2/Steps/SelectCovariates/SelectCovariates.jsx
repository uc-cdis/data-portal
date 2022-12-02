import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import ContinuousCovariates from '../../Components/Covariates/ContinuousCovariates';
import CustomDichotomousCovariates from '../../Components/Covariates/CustomDichotomousCovariates';

const SelectCovariates = ({
  dispatch,
  studyPopulationCohort,
  outcome,
  covariates,
}) => {
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
          covariates={covariates}
          outcome={outcome}
          type={'covariate'}
        />
      )}

      {mode === 'dichotomous' && (
        <CustomDichotomousCovariates
          setMode={setMode}
          dispatch={dispatch}
          studyPopulationCohort={studyPopulationCohort}
          covariates={covariates}
          outcome={outcome}
          type={'covariate'}
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
  studyPopulationCohort: PropTypes.object.isRequired,
  outcome: PropTypes.object.isRequired,
  covariates: PropTypes.array.isRequired,
};

export default SelectCovariates;
