import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import ContinuousCovariates from '../Shared/GWASCovariates/ContinuousCovariates';
import CustomDichotomousCovariates from '../Shared/GWASCovariates/CustomDichotomousCovariates';

const SelectOutcome = ({
  // allCovariates,
  handleOutcomeSubmit,
  handleOutcomeSelect,
  outcome,
  sourceId,
  current,
}) => {
  const [mode, setMode] = useState('');
  return (
    <div>
      {mode === 'continuous'
      // todo: add filter to allCovariates : .filter((cov) => concept_id in cov)
        ? (
          <ContinuousCovariates
            // covariates={allCovariates}
            sourceId={sourceId}
            setMode={setMode}
            selected={outcome}
            handleSubmit={handleOutcomeSubmit}
            handleSelect={handleOutcomeSelect}
          />
        )
        : mode === 'dichotomous'
        // todo: add filter to allCovariates : .filter((cov) => provided_name in cov)
          ? (
            <CustomDichotomousCovariates
            // customDichotomousCovariates={allCovariates}
              setMode={setMode}
              sourceId={sourceId}
              handleCovariateSubmit={handleOutcome}
              handleCovariateSelect={handleCovariateSelect}
              selectedCovariate={outcome}
              current={current}
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
  // allCovariates: PropTypes.array.isRequired,
  sourceId: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
  outcome: PropTypes.object,
};

SelectOutcome.defaultProps = {
  outcome: undefined,
};

export default SelectOutcome;
