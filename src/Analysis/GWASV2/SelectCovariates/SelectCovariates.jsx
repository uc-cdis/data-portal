import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import ContinuousCovariates from '../Shared/Covariates/ContinuousCovariates';
import CustomDichotomousCovariates from '../Shared/Covariates/CustomDichotomousCovariates';

const SelectCovariates = ({
  handleCovariateSubmit,
  allCovariates,
  // current,
}) => {
  const [mode, setMode] = useState(undefined);
  const [selectedCovariate, setSelectedCovariate] = useState({});

  return (
    <React.Fragment>
      {mode === 'continuous'
        // todo: add filter to allCovariates : .filter((cov) => concept_id in cov)
        && (
          <ContinuousCovariates
            setMode={setMode}
            selected={selectedCovariate}
            handleSubmit={handleCovariateSubmit}
            handleSelect={setSelectedCovariate}
            allCovariates={allCovariates}
            type={"covariate"}
          />
        )}

      {mode === 'dichotomous'
        // todo: add filter to allCovariates : .filter((cov) => provided_name in cov)
        && (
          <CustomDichotomousCovariates
            setMode={setMode}
            handleSubmit={handleCovariateSubmit}
            // selected={selectedCovariate}
            allCovariates={allCovariates}

            // current={current}
          />
        )}
      {!mode && (
        <div>
          <button
            type='button'
            style={{
              height: 60,
              marginRight: 5
            }}
            onClick={() =>
            setMode('continuous')}>
            Add Continuous Outcome Covariate
          </button>
          <button
            type='button'
            style={{
              height: 60,
              marginLeft: 5
            }}
            onClick={() => setMode('dichotomous')}>
            Add Dichotomous Outcome Covariate
          </button>
        </div>
      )}
    </React.Fragment>
  );
};

SelectCovariates.propTypes = {
  handleCovariateSubmit: PropTypes.func.isRequired,
  // current: PropTypes.number.isRequired,
  allCovariates: PropTypes.array.isRequired
};

export default SelectCovariates;
