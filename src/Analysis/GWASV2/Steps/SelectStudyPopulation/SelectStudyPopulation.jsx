import React from 'react';
import PropTypes from 'prop-types';
import ACTIONS from '../../Utils/StateManagement/Actions';
import CohortSelect from '../../Components/SelectCohort/SelectCohort';

const SelectStudyPopulation = ({ selectedCohort, dispatch }) => {
  const handleStudyPopulationSelect = (selectedRow) => {
    dispatch({
      type: ACTIONS.SET_SELECTED_STUDY_POPULATION_COHORT,
      payload: selectedRow,
    });
  };

  return (
    <div data-tour='cohort-select'>
      <CohortSelect
        selectedCohort={selectedCohort}
        handleCohortSelect={handleStudyPopulationSelect}
      />
    </div>
  );
};

SelectStudyPopulation.propTypes = {
  dispatch: PropTypes.func.isRequired,
  selectedCohort: PropTypes.object,
};
SelectStudyPopulation.defaultProps = { selectedCohort: null };
export default SelectStudyPopulation;
