import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import ContinuousCovariates from '../Shared/Covariates/ContinuousCovariates';
import CustomDichotomousCovariates from '../Shared/Covariates/CustomDichotomousCovariates';

const SelectCovariates = ({ dispatch, covariates, outcome }) => {
  const [variableType, setVariableType] = useState(undefined);
  const [selectedCovariate, setSelectedCovariate] = useState({});

  let covariateMenu = variableType === 'continuous' ? (
    // todo: add filter to allCovariates : .filter((cov) => concept_id in cov)
    <ContinuousCovariates
      setVariableType={setVariableType}
      selVcted={selectedCovariate}
      dispatch={dispatch}
      handleSelect={setSelectedCovariate}
      covariates={covariates}
      outcome={outcome}
      type={'covariates'}
    />
  ) : (
    // todo: add filter to allCovariates : .filter((cov) => provided_name in cov)
    <CustomDichotomousCovariates
      setVariableType={setVariableType}
      dispatch={dispatch}
      covariates={covariates}
      outcome={outcome}
      type={'covariates'}
    />
  )
  return (
    <React.Fragment>
      {variableType && covariateMenu}
      {!variableType && (
        <div>
          <button
            type='button'
            style={{
              height: 60,
              marginRight: 5,
            }}
            onClick={() => setVariableType('continuous')}
          >
            Add Continuous Outcome Covariate
          </button>
          <button
            type='button'
            style={{
              height: 60,
              marginLeft: 5,
            }}
            onClick={() => setVariableType('dichotomous')}
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
