import React, { useState } from 'react';
import { Space, Popover } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { chooseCovariateCaption } from './captions';
import Covariates from './Covariates';
import '../../GWASUIApp/GWASUIApp.css';

const CovariateSelect = ({ sourceId, selectedCovariates, handleCovariateSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [covariatePage, setCovariatePage] = useState(1);

    const handleCovariatePage = () => {
        console.log('hi handle cov');
    }

    return (
        <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
            <h4 className='GWASUI-selectInstruction'>In this step, you will select the harmonized variables for your study. Please select all variables you wish to use in your model, including both covariates and phenotype. (Note: population PCs are not included in this step)</h4>
            <input placeholder="Filter options by name" onChange={(e) => setSearchTerm(e.target.value)} />
            <div className='GWASUI-mainTable'>
                <Popover content={chooseCovariateCaption} title='Choosing covariates'>
                    <InfoCircleOutlined />
                </Popover>
                <Covariates sourceId={sourceId} searchTerm={searchTerm} selectedCovariates={selectedCovariates} handleCovariateSelect={handleCovariateSelect} page={covariatePage} handlePage={handleCovariatePage}></Covariates>
            </div>
        </Space>
    );
}

export default CovariateSelect;
