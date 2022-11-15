import React from 'react';
import PropTypes from 'prop-types';
import AttritionTable from './AttritionTable/AttritionTable';

const AttritionTableWrapper = ({
  newCovariateSubset,
  selectedCohort,
  otherSelectedCohort,
  outcome,
  sourceId,
}) => {
  const useSecondTable = outcome.variable_type === 'custom_dichotomous';
  return (
    <React.Fragment>
      <AttritionTable
        sourceId={sourceId}
        covariates={newCovariateSubset}
        selectedCohort={selectedCohort}
        otherSelectedCohort={otherSelectedCohort}
        outcome={outcome}
        tableHeader={
          useSecondTable ? 'Case Cohort Attrition Table' : 'Attrition Table'
        }
      />
      {useSecondTable && (
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
};
AttritionTableWrapper.propTypes = {
  selectedCohort: PropTypes.object,
  outcome: PropTypes.object,
  newCovariateSubset: PropTypes.array.isRequired,
  sourceId: PropTypes.number.isRequired,
};

AttritionTableWrapper.defaultProps = {
  selectedCohort: undefined,
  outcome: undefined,
};
export default AttritionTableWrapper;
