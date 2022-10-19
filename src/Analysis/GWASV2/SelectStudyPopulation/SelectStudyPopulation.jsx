import React from 'react';
import PropTypes from 'prop-types';
import CohortSelect from './Utils/CohortSelect';
import './SelectStudyPopulation.css';

const SelectStudyPopulation = ({
  selectedStudyPopulationCohort,
  setSelectedStudyPopulationCohort,
  current,
  sourceId,
}) => (
  <CohortSelect
    selectedCohort={selectedStudyPopulationCohort}
    handleCohortSelect={setSelectedStudyPopulationCohort}
    sourceId={sourceId}
    current={current}
  />
);

SelectStudyPopulation.propTypes = {
  selectedStudyPopulationCohort: PropTypes.object.isRequired,
  setSelectedStudyPopulationCohort: PropTypes.func.isRequired,
  current: PropTypes.number.isRequired,
  sourceId: PropTypes.number.isRequired,
};

export default SelectStudyPopulation;
