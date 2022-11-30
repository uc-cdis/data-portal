import React from 'react';
import PropTypes from 'prop-types';
import ACTIONS from '../../Shared/StateManagement/Actions';
import CohortSelect from '../../CohortSelect/CohortSelect';

const SelectStudyPopulation = ({ selectedCohort, dispatch }) => {
  const handleStudyPopulationSelect = (selectedRow) => {
    dispatch({
      type: ACTIONS.SET_SELECTED_STUDY_POPULATION_COHORT,
      payload: selectedRow,
    });
  };

  return (
    <CohortSelect
      selectedCohort={selectedCohort}
      handleCohortSelect={handleStudyPopulationSelect}
    />
  );
};

SelectStudyPopulation.propTypes = {
  dispatch: PropTypes.func.isRequired,
  selectedCohort: PropTypes.object,
};
SelectStudyPopulation.defaultProps = { selectedCohort: null };
export default SelectStudyPopulation;
