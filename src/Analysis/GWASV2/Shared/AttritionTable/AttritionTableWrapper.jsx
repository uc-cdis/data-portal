import React, { useState, useEffect } from "react";
import AttritionTable from "./AttritionTable";
import PropTypes from "prop-types";

const AttritionTableWrapper = ({
  selectedCohort,
  otherSelectedCohort,
  outcome,
  selectedCovariates,
  selectedDichotomousCovariates,
  sourceId,
}) => {
  return (
    <>
      <AttritionTable
        sourceId={sourceId}
        selectedCohort={selectedCohort}
        otherSelectedCohort={otherSelectedCohort}
        // outcome={outcome}
        selectedCovariates={selectedCovariates}
        selectedDichotomousCovariates={selectedDichotomousCovariates}
        tableHeader={"Case Cohort Attrition Table"}
      />
      <AttritionTable
        sourceId={sourceId}
        selectedCohort={selectedCohort}
        otherSelectedCohort={otherSelectedCohort}
        // outcome={outcome}
        selectedCovariates={selectedCovariates}
        selectedDichotomousCovariates={selectedDichotomousCovariates}
        tableHeader={"Control Cohort Attrition Table"}
      />
    </>
  );
};
AttritionTableWrapper.propTypes = {
  selectedCohort: PropTypes.object,
  otherSelectedCohort: PropTypes.object,
  outcome: PropTypes.object,
  selectedCovariates: PropTypes.array.isRequired,
  selectedDichotomousCovariates: PropTypes.array.isRequired,
  sourceId: PropTypes.number.isRequired,
};

AttritionTableWrapper.defaultProps = {
  selectedCohort: undefined,
  otherSelectedCohort: undefined,
  outcome: undefined,
};
export default AttritionTableWrapper;
