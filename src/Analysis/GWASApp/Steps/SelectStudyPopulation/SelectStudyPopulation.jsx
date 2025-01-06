import React from 'react';
import PropTypes from 'prop-types';
import ACTIONS from '../../Utils/StateManagement/Actions';
import SelectCohort from '../../Components/SelectCohort/SelectCohort';

const SelectStudyPopulation = ({ selectedCohort, dispatch, selectedTeamProject }) => {
  const handleStudyPopulationSelect = (selectedRow) => {
    dispatch({
      type: ACTIONS.SET_SELECTED_STUDY_POPULATION_COHORT,
      payload: selectedRow,
    });
  };

  return (
    <div data-tour='cohort-select'>
      <SelectCohort
        selectedCohort={selectedCohort}
        handleCohortSelect={handleStudyPopulationSelect}
        selectedTeamProject={selectedTeamProject}
      />
    </div>
  );
};

SelectStudyPopulation.propTypes = {
  dispatch: PropTypes.func.isRequired,
  selectedCohort: PropTypes.object,
  selectedTeamProject: PropTypes.string.isRequired,
};
SelectStudyPopulation.defaultProps = { selectedCohort: null };
export default SelectStudyPopulation;
