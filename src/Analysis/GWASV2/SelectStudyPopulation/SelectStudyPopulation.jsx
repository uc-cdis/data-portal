import React, { useState } from "react";
import { Space, Spin } from 'antd';
import AddCohortButton from "./AddCohortButton";
import CohortSelect from "./CohortSelect";
import { useSourceFetch } from '../../GWASWizard/wizardEndpoints/cohortMiddlewareApi';

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
          <div data-tour='step-1-new-cohort' className='GWASUI-mt-15'>
            <AddCohortButton />
          </div>
            <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
              <div className='GWASUI-mainTable'>
                <CohortSelect
                  selectedCohort={selectedCaseCohort}
                  handleCohortSelect={handleCaseCohortSelect}
                  sourceId={sourceId}
                  current={current}
                />
              </div>
            </Space>
          </>
    ):  <Spin />);
}

export default SelectStudyPopulation;
