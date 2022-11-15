import React from 'react';
import PropTypes from 'prop-types';
import AttritionTable from './AttritionTable/AttritionTable';

const AttritionTableWrapper = ({
  newCovariateSubset,
  selectedCohort,
  otherSelectedCohort,
  outcome,
  sourceId,
}) => (
  <React.Fragment>
    <AttritionTable
      sourceId={sourceId}
      covariates={newCovariateSubset}
      selectedCohort={selectedCohort}
      otherSelectedCohort={otherSelectedCohort}
      outcome={outcome}
      tableHeader={'Case Cohort Attrition Table'}
    />
    {outcome.variable_type === 'custom_dichotomous' && (
      <AttritionTable
        sourceId={sourceId}
        covariates={newCovariateSubset}
        selectedCohort={selectedCohort}
        otherSelectedCohort={otherSelectedCohort}
        outcome={outcome}
        tableHeader={'Control Cohort Attrition Table'}
      />
    )}
  </React.Fragment>
);
AttritionTableWrapper.propTypes = {
  selectedCohort: PropTypes.object,
  otherSelectedCohort: PropTypes.object,
  outcome: PropTypes.object,
  newCovariateSubset: PropTypes.array.isRequired,
  sourceId: PropTypes.number.isRequired,
};

AttritionTableWrapper.defaultProps = {
  selectedCohort: undefined,
  otherSelectedCohort: undefined,
  outcome: undefined,
};
export default AttritionTableWrapper;
