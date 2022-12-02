import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import ContinuousCovariates from '../Shared/Covariates/ContinuousCovariates';
import CustomDichotomousCovariates from '../Shared/Covariates/CustomDichotomousCovariates';

const SelectOutcome = ({ covariates, dispatch, outcome }) => {
  const [variableType, setVariableType] = useState(undefined);
  const [selectedOutcome, setSelectedOutcome] = useState({});

  let outcomeMenu =
    variableType === 'continuous' ?
      <ContinuousCovariates
        setVariableType={setVariableType}
        selected={selectedOutcome}
        dispatch={dispatch}
        handleSelect={setSelectedOutcome}
        covariates={covariates}
        outcome={outcome}
        type={'outcome'}
      /> :
      <CustomDichotomousCovariates
        setVariableType={setVariableType}
        dispatch={dispatch}
        covariates={covariates}
        outcome={outcome}
        type={'outcome'}
      />
  return (<>
    {variableType && outcomeMenu}
    {!variableType && <div>
      <button
        type='button'
        style={{ height: 60, marginRight: 5 }}
        onClick={() => setVariableType('continuous')}
      >
        Add Continuous Outcome Phenotype
      </button>
      <button
        type='button'
        style={{ height: 60, marginRight: 5 }}
        onClick={() => setVariableType('dichotomous')}
      >
        Add Dichotomous Outcome Phenotype
      </button>
    </div>}
  </>)
}

SelectOutcome.propTypes = {
  dispatch: PropTypes.func.isRequired,
  covariates: PropTypes.array.isRequired,
  outcome: PropTypes.object,
};

SelectOutcome.defaultProps = {
  outcome: null,
};

export default SelectOutcome;
