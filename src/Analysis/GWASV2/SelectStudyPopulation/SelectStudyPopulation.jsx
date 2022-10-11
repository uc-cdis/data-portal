import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import CohortSelect from './Utils/CohortSelect';
import { useSourceFetch } from '../../GWASWizard/wizardEndpoints/cohortMiddlewareApi';
import './SelectStudyPopulation.css';

const SelectStudyPopulation = ({ selectedCaseCohort, setSelectedCaseCohort, current }) => {
  const handleCaseCohortSelect = (cohort) => {
    setSelectedCaseCohort(cohort);
  };
  const { loading, sourceId } = useSourceFetch();

  return (!loading && sourceId ? (
    <CohortSelect
      selectedCohort={selectedCaseCohort}
      handleCohortSelect={handleCaseCohortSelect}
      sourceId={sourceId}
      current={current}
    />
  ) : <Spin />);
};

SelectStudyPopulation.propTypes = {
  selectedCaseCohort: PropTypes.object.isRequired,
  setSelectedCaseCohort: PropTypes.func.isRequired,
  current: PropTypes.number.isRequired,
};

export default SelectStudyPopulation;
