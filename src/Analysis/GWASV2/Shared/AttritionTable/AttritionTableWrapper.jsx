import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AttritionTable from './AttritionTable';

const AttritionTableWrapper = ({
  newCovariateSubset,
  selectedCohort,
  otherSelectedCohort,
  outcome,
  selectedCovariates,
  selectedDichotomousCovariates,
  sourceId,
}) => (
  <React.Fragment>
    <AttritionTable
      sourceId={sourceId}
      newCovariateSubset={newCovariateSubset}
      selectedCohort={selectedCohort}
      otherSelectedCohort={otherSelectedCohort}
      outcome={outcome}
      // selectedCovariates={selectedCovariates}
      // selectedDichotomousCovariates={selectedDichotomousCovariates}
      tableHeader={'Case Cohort Attrition Table'}
    />
    {outcome.variable_type === 'custom_dichotomous' && (
      <AttritionTable
        sourceId={sourceId}
        newCovariateSubset={newCovariateSubset}
        selectedCohort={selectedCohort}
        otherSelectedCohort={otherSelectedCohort}
        outcome={outcome}
        // selectedCovariates={selectedCovariates}
        // selectedDichotomousCovariates={selectedDichotomousCovariates}
        tableHeader={'Control Cohort Attrition Table'}
      />
    )}
  </React.Fragment>
);
AttritionTableWrapper.propTypes = {
  selectedCohort: PropTypes.object,
  otherSelectedCohort: PropTypes.object,
  outcome: PropTypes.object,
  // selectedCovariates: PropTypes.array.isRequired,
  // selectedDichotomousCovariates: PropTypes.array.isRequired,
  newCovariateSubset: PropTypes.array.isRequired,
  sourceId: PropTypes.number.isRequired,
};

AttritionTableWrapper.defaultProps = {
  selectedCohort: undefined,
  otherSelectedCohort: undefined,
  outcome: undefined,
};
export default AttritionTableWrapper;
