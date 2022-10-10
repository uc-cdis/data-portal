import React, { useState } from "react";
import { Space, Spin } from 'antd';
import AddCohortButton from "./AddCohortButton";
import CohortSelect from "./CohortSelect";
import { useSourceFetch } from '../../GWASWizard/wizardEndpoints/cohortMiddlewareApi';
import './SelectStudyPopulation.css'
 const SelectStudyPopulation = () => {
    const [current, setCurrent] = useState(0);

    const [selectedCaseCohort, setSelectedCaseCohort] = useState(undefined);
    const handleCaseCohortSelect = (cohort) => {
        setSelectedCaseCohort(cohort);
    };
    const { loading, sourceId } = useSourceFetch();

    return (!loading && sourceId ? (
    <>
    <h1>Hello world from Select Study Population</h1>
            <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>

                <CohortSelect
                  selectedCohort={selectedCaseCohort}
                  handleCohortSelect={handleCaseCohortSelect}
                  sourceId={sourceId}
                  current={current}
                />

            </Space>
          </>
    ):  <Spin />);
}

export default SelectStudyPopulation;
