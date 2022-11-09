import React from "react";
import PropTypes from "prop-types";
import CohortSelect from "./Utils/CohortSelect";
import "./SelectStudyPopulation.css";

const SelectStudyPopulation = ({
  selectedStudyPopulationCohort,
  setSelectedStudyPopulationCohort,
  current,
  sourceId
}) => {

  return <CohortSelect
      selectedCohort={selectedStudyPopulationCohort}
      handleCohortSelect={setSelectedStudyPopulationCohort}
      sourceId={sourceId}
      current={current}
    />
};

SelectStudyPopulation.propTypes = {
  selectedStudyPopulationCohort: PropTypes.any.isRequired,
  setSelectedStudyPopulationCohort: PropTypes.any.isRequired,
  current: PropTypes.number.isRequired,
  sourceId: PropTypes.number.isRequired
};

export default SelectStudyPopulation;
