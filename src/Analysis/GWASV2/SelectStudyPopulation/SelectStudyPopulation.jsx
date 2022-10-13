import React from "react";
import PropTypes from "prop-types";
import { Spin } from "antd";
import CohortSelect from "./Utils/CohortSelect";
import { useSourceFetch } from "../../GWASWizard/wizardEndpoints/cohortMiddlewareApi";
import "./SelectStudyPopulation.css";

const SelectStudyPopulation = ({
  selectedStudyPopulationCohort,
  setSelectedStudyPopulationCohort,
  current,
}) => {
  const handleCaseCohortSelect = (cohort) => {
    setSelectedStudyPopulationCohort(cohort);
  };
  const { loading, sourceId } = useSourceFetch();

  return !loading && sourceId ? (
    <CohortSelect
      selectedCohort={selectedStudyPopulationCohort}
      handleCohortSelect={handleCaseCohortSelect}
      sourceId={sourceId}
      current={current}
    />
  ) : (
    <Spin />
  );
};

SelectStudyPopulation.propTypes = {
  selectedStudyPopulationCohort: PropTypes.object.isRequired,
  setSelectedStudyPopulationCohort: PropTypes.func.isRequired,
  current: PropTypes.number.isRequired,
};

export default SelectStudyPopulation;
