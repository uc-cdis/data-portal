import React from 'react';
import PropTypes from 'prop-types';
import AttritionTable from './AttritionTable/AttritionTable';

const AttritionTableWrapper = ({
  covariates,
  selectedCohort,
  outcome,
  sourceId,
}) => {
  const useSecondTable = outcome?.variable_type === 'custom_dichotomous';
  return (
    <React.Fragment>
      <AttritionTable
        sourceId={sourceId}
        covariates={covariates}
        selectedCohort={selectedCohort}
        outcome={outcome}
        tableType={useSecondTable ? 'Case Cohort' : ''}
      />
      {useSecondTable && (
        <AttritionTable
          sourceId={sourceId}
          covariates={covariates}
          selectedCohort={selectedCohort}
          outcome={outcome}
          tableType={'Control Cohort'}
        />
      )}
    </React.Fragment>
  );
};
AttritionTableWrapper.propTypes = {
  selectedCohort: PropTypes.object,
  outcome: PropTypes.object,
  covariates: PropTypes.array.isRequired,
  sourceId: PropTypes.number.isRequired,
};

AttritionTableWrapper.defaultProps = {
  selectedCohort: null,
  outcome: null,
};
export default AttritionTableWrapper;
