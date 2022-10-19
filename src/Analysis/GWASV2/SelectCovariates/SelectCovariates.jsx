/* eslint-disable */
// todo maybe refactor in a way that doesnt use nested ternary
// no-nested-ternary rule
import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import ContinuousCovariates from '../Shared/GWASCovariates/ContinuousCovariates';
import CustomDichotomousCovariates from '../Shared/GWASCovariates/CustomDichotomousCovariates';

const SelectCovariates = ({
  handleCovariateSubmit,
  selectedCovariate,
  sourceId,
  current,
}) => {
  const [mode, setMode] = useState('');
  return (
    <React.Fragment>
      {mode === 'continuous'
      // todo: add filter to allCovariates : .filter((cov) => concept_id in cov)
        ? (
          <ContinuousCovariates
            // covariates={allCovariates}
            handleCovariateSubmit={handleCovariateSubmit}
            selectedCovariate={selectedCovariate}
            sourceId={sourceId}
            setMode={setMode}
          />
        )
        : mode === 'dichotomous'
        // todo: add filter to allCovariates : .filter((cov) => provided_name in cov)
          ? (
            <CustomDichotomousCovariates
              handleCovariateSubmit={handleCovariateSubmit}
              sourceId={sourceId}
              setMode={setMode}
              current={current}
            />
          )
          : (
            <div>
              <button type='button' style={{ height: 60, marginRight: 5 }} onClick={() => setMode('continuous')}>Add Continuous Outcome Phenotype</button>
              <button type='button' style={{ height: 60, marginLeft: 5 }} onClick={() => setMode('dichotomous')}>Add Dichotomous Outcome Phenotype</button>
            </div>
          )}
    </React.Fragment>
  );
};

SelectCovariates.propTypes = {
  handleCovariateSubmit: PropTypes.func.isRequired,
  sourceId: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
  selectedCovariate: PropTypes.object,
};

SelectCovariates.defaultProps = {
  selectedCovariate: undefined,
};

export default SelectCovariates;
