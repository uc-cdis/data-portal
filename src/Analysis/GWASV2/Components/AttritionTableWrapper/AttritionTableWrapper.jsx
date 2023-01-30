import React from 'react';
import PropTypes from 'prop-types';
import AttritionTable from './AttritionTable/AttritionTable';

const AttritionTableWrapper = ({ covariates, selectedCohort, outcome }) => {
  const useSecondTable = outcome?.variable_type === 'custom_dichotomous';
  return (
    <div data-tour='attrition-table'>
      <AttritionTable
        covariates={covariates}
        selectedCohort={selectedCohort}
        outcome={outcome}
        tableType={useSecondTable ? 'Case Cohort' : ''}
      />
      {useSecondTable && (
        <AttritionTable
          covariates={covariates}
          selectedCohort={selectedCohort}
          outcome={outcome}
          tableType={'Control Cohort'}
        />
      )}
    </div>
  );
};
AttritionTableWrapper.propTypes = {
  selectedCohort: PropTypes.object,
  outcome: PropTypes.object,
  covariates: PropTypes.array.isRequired,
};

AttritionTableWrapper.defaultProps = {
  selectedCohort: null,
  outcome: null,
};
export default AttritionTableWrapper;
