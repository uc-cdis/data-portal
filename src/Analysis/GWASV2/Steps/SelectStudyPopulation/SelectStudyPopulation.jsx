import React from 'react';
import PropTypes from 'prop-types';
import CohortSelect from '../../CohortSelect/CohortSelect';
import ACTIONS from '../../Shared/StateManagement/Actions';

const SelectStudyPopulation = ({ dispatch, selectedStudyPopulationCohort }) => {
  const handleStudyPopulationSelect = (selectedRow) => {
    dispatch({
      type: ACTIONS.SET_SELECTED_STUDY_POPULATION_COHORT,
      payload: selectedRow,
    });
  };

  return (
    <CohortSelect
      selectedCohort={selectedStudyPopulationCohort}
      handleCohortSelect={handleStudyPopulationSelect}
    />
  );
};

SelectStudyPopulation.propTypes = {
  dispatch: PropTypes.func.isRequired,
  selectedStudyPopulationCohort: PropTypes.object,
};
SelectStudyPopulation.defaultProps = { selectedStudyPopulationCohort: null };

export default SelectStudyPopulation;
