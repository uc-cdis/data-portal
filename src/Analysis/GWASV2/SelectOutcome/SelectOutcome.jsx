import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import ContinuousCovariates from '../Shared/Covariates/ContinuousCovariates';
import CustomDichotomousCovariates from '../Shared/Covariates/CustomDichotomousCovariates';

const SelectOutcome = ({
  allCovariates,
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
            // covariates={allCovariates}
            setMode={setMode}
            selected={selectedOutcome}
            handleSubmit={handleOutcome}
            handleSelect={setSelectedOutcome}
            type={"outcome"}
          />
        )
        : mode === 'dichotomous'
        // todo: add filter to allCovariates : .filter((cov) => provided_name in cov)
          ? (
            <CustomDichotomousCovariates
            // customDichotomousCovariates={allCovariates}
              setMode={setMode}
              handleSubmit={handleOutcome}
            //   handleSelect={setSelectedOutcome}
            //   current={current}
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
  allCovariates: PropTypes.array.isRequired,
//   current: PropTypes.number.isRequired,
  outcome: PropTypes.object,
};

SelectOutcome.defaultProps = {
  outcome: undefined,
};

export default SelectOutcome;
