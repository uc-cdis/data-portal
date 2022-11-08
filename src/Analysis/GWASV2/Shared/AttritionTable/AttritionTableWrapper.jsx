import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AttritionTable from "./AttritionTable";
const AttritionTableWrapper = ({
  covariateSubset,
  selectedCohort,
  otherSelectedCohort,
  outcome,
  selectedCovariates,
  selectedDichotomousCovariates,
  sourceId,
}) => {
  // Given input arr below, output should be: [["A"], ["A", "B"], ["A", "B", "C"]]
  const inputArr = ["A", "B", "C"];

  const createCovariateSubset = (inputArr) => {
    const outputArr = [];
    const prevArr = [];
    inputArr.forEach((item, index) => {
      prevArr.push(inputArr[index]);
      outputArr.push([...prevArr]);
    });
    return outputArr;
  };

  console.log("Final Output:", createCovariateSubset(inputArr));

  return (
    <>
      <AttritionTable
        sourceId={sourceId}
        covariateSubset={covariateSubset}
        selectedCohort={selectedCohort}
        otherSelectedCohort={otherSelectedCohort}
        outcome={outcome}
        selectedCovariates={selectedCovariates}
        selectedDichotomousCovariates={selectedDichotomousCovariates}
        tableHeader={"Case Cohort Attrition Table"}
      />
      {Object.keys(outcome).length !== 0 && (
        <AttritionTable
          sourceId={sourceId}
          covariateSubset={covariateSubset}
          selectedCohort={selectedCohort}
          otherSelectedCohort={otherSelectedCohort}
          outcome={outcome}
          selectedCovariates={selectedCovariates}
          selectedDichotomousCovariates={selectedDichotomousCovariates}
          tableHeader={"Control Cohort Attrition Table"}
        />
      )}
    </>
  );
};
AttritionTableWrapper.propTypes = {
  selectedCohort: PropTypes.object,
  otherSelectedCohort: PropTypes.object,
  outcome: PropTypes.object,
  selectedCovariates: PropTypes.array.isRequired,
  selectedDichotomousCovariates: PropTypes.array.isRequired,
  covariateSubset: PropTypes.array.isRequired,
  sourceId: PropTypes.number.isRequired,
};

AttritionTableWrapper.defaultProps = {
  selectedCohort: undefined,
  otherSelectedCohort: undefined,
  outcome: undefined,
};
export default AttritionTableWrapper;
