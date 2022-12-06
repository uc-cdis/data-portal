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
    <div
      style={{
        width: '80%',
        margin: 'auto',
        height: '600px',
        border: "1px solid red"
      }}
    >
      {variableType && outcomeMenu}
      {!variableType && <div style={{
        height: '80%',
        display: "flex",
        direction: "row"
      }}>
        <button
          type='button'
          style={{ height: 60, margin: 'auto' }}
          onClick={() => setVariableType('continuous')}
        >
          Add Continuous Outcome Phenotype
        </button>
        <button
          type='button'
          style={{ height: 60, margin: 'auto' }}
          onClick={() => setVariableType('dichotomous')}
        >
          Add Dichotomous Outcome Phenotype
        </button>
      </div>}
    </div>
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
