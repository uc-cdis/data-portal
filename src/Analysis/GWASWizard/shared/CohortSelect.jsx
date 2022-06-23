import React, { useEffect, useState } from 'react';
import CohortDefinitions from "./CohortDefinitions";
import { InfoCircleOutlined } from '@ant-design/icons';
import { atlasDomain } from "../wizard-endpoints/cohort-middleware-api";
import '../../GWASUIApp/GWASUIApp.css';
import {
    Space, Popover
} from 'antd';


const CohortSelect = ({ selectedCohort, handleCohortSelect, sourceId }) => {
    const newCohortContent = (
        <div>
          <p>This button will open a new tab in your browser, outside of the Gen3 GWAS App and send you to OHDSI Atlas App</p>
        </div>
      );
      const chooseCohortContent = (
        <div>
          <p>You may only see cohorts that you have access to. Please select only one cohort. The size of the cohort population is indicated in the right hand side of the table. To browse the table please scroll down to the bottom.</p>
        </div>
      );
    return (
        <React.Fragment>
            <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
                <h4 className='GWASUI-selectInstruction'>In this step, you will determine the study population. To begin, select the cohort that you would like to define your study population with.</h4>
                <Popover content={newCohortContent} title='Create a new cohort'>
                    <InfoCircleOutlined />
                </Popover>
                <button onClick={() => window.open(atlasDomain(), '_blank')} >+ Add a new cohort</button>
                <div className='GWASUI-mainTable'>
                    <Popover content={chooseCohortContent} title='Choosing a cohort'>
                        <InfoCircleOutlined />
                    </Popover>
                    <CohortDefinitions selectedCohort={selectedCohort} handleCohortSelect={handleCohortSelect} sourceId={sourceId}></CohortDefinitions>
                </div>
            </Space>
        </React.Fragment>
    )
}


export default CohortSelect;
