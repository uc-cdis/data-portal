import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import ContinuousCovariates from '../../Shared/Covariates/ContinuousCovariates';
import CustomDichotomousCovariates from '../../Shared/Covariates/CustomDichotomousCovariates';

const SelectCovariates = ({ dispatch, covariates, outcome }) => {
  const [mode, setMode] = useState(undefined);
  const [selectedCovariate, setSelectedCovariate] = useState({});

  return (
    <React.Fragment>
      {mode === 'continuous' && (
        // todo: add filter to allCovariates : .filter((cov) => concept_id in cov)
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
        // todo: add filter to allCovariates : .filter((cov) => provided_name in cov)
        <CustomDichotomousCovariates
          setMode={setMode}
          dispatch={dispatch}
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
  covariates: PropTypes.array.isRequired,
  outcome: PropTypes.object.isRequired,
};

export default SelectCovariates;
