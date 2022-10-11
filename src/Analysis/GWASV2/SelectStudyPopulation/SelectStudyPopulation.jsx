import React, { useState } from "react";
import { Spin } from 'antd';
import CohortSelect from "./Utils/CohortSelect";
import { useSourceFetch } from '../../GWASWizard/wizardEndpoints/cohortMiddlewareApi';
import './SelectStudyPopulation.css'

const SelectStudyPopulation = ({selectedCaseCohort, setSelectedCaseCohort}) => {
  const [current, setCurrent] = useState(0);

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
    ):  <Spin />);
}

export default SelectStudyPopulation;
