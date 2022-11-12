import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import ContinuousCovariates from '../Shared/Covariates/ContinuousCovariates';
import CustomDichotomousCovariates from '../Shared/Covariates/CustomDichotomousCovariates';

const SelectOutcome = ({
  covariates,
  handleOutcome,
  outcome,
}) => {
  const [mode, setMode] = useState('');
  const [selectedOutcome, setSelectedOutcome] = useState({});

  return (
    <div>
      {mode === 'continuous'
      // todo: add filter to allCovariates : .filter((cov) => concept_id in cov)
        ? (
          <ContinuousCovariates
            setMode={setMode}
            selected={selectedOutcome}
            handleSubmit={handleOutcome}
            handleSelect={setSelectedOutcome}
            covariates={covariates}
            outcome={outcome}
            type={"outcome"}
          />
        )
        : mode === 'dichotomous'
        // todo: add filter to allCovariates : .filter((cov) => provided_name in cov)
          ? (
            <CustomDichotomousCovariates
              setMode={setMode}
              handleSubmit={handleOutcome}
              covariates={covariates}
              outcome={outcome}
              type={"outcome"}
            />
          )
          : (
            <div>
              <button type='button' style={{ height: 60, marginRight: 5 }} onClick={() => setMode('continuous')}>Add Continuous Outcome Phenotype</button>
              <button type='button' style={{ height: 60, marginRight: 5 }} onClick={() => setMode('dichotomous')}>Add Dichotomous Outcome Phenotype</button>
            </div>
          )}
    </div>
  );
};

SelectOutcome.propTypes = {
  handleOutcome: PropTypes.func.isRequired,
  covariates: PropTypes.array.isRequired,
  outcome: PropTypes.object,
};

SelectOutcome.defaultProps = {
  outcome: undefined,
};

export default SelectOutcome;
