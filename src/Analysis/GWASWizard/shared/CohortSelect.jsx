import React, { useEffect, useState } from 'react';
import CohortDefinitions from "./CohortDefinitions";
import { InfoCircleOutlined } from '@ant-design/icons';

import '../../GWASUIApp/GWASUIApp.css';
import {
    Space, Popover
} from 'antd';


const CohortSelect = ({ selectedCohort, handleCohortSelect, sourceId, otherCohortSelected = '' }) => {


    return (
        // <React.Fragment>
        //     <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
        //         <h4 className='GWASUI-selectInstruction'>In this step, you will determine the study population. To begin, select the cohort that you would like to define your study population with.</h4>

        //         <div className='GWASUI-mainTable'>
                    <CohortDefinitions selectedCohort={selectedCohort} handleCohortSelect={handleCohortSelect} sourceId={sourceId} otherCohortSelected={otherCohortSelected}></CohortDefinitions>
        //         </div>
        //     </Space>
        // </React.Fragment>
    )
}


export default CohortSelect;
