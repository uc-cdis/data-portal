import React, { useState } from "react";
import { Space, Spin } from 'antd';
import CohortSelect from "./Utils/CohortSelect";
import { useSourceFetch } from '../../GWASWizard/wizardEndpoints/cohortMiddlewareApi';
import '../../GWASUIApp/GWASUIApp.css'
import './SelectStudyPopulation.css'

const SelectStudyPopulation = () => {
  const [current, setCurrent] = useState(0);

  const [selectedCaseCohort, setSelectedCaseCohort] = useState(undefined);
  const handleCaseCohortSelect = (cohort) => {
      setSelectedCaseCohort(cohort);
  };
  const { loading, sourceId } = useSourceFetch();

  return (!loading && sourceId ? (
    <Space direction={'vertical'} align={'center'}
      style={{ width: '100%' }}>
        <CohortSelect
          selectedCohort={selectedCaseCohort}
          handleCohortSelect={handleCaseCohortSelect}
          sourceId={sourceId}
          current={current}
        />
    </Space>
    ):  <Spin />);
}

export default SelectStudyPopulation;
