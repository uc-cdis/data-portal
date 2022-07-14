import React, { useState } from 'react';
import {
   Space, InputNumber, Select,
  } from 'antd';

import '../../GWASUIApp/GWASUIApp.css';
import CovariateStatsByHareCC from "../CovariateStatsByHareCC";
// import CovariateStatsByHareQ from "../CovariateStatsByHareQ";

const WorkflowParameters = ({ selectedHare, caseCohortDefinitionId, controlCohortDefinitionId, selectedCovariates, selectedDichotomousCovariates, sourceId, workflowType }) => {
    const [numOfPC, setNumOfPC] = useState(3);
    const [imputationScore, setImputationScore] = useState(0.3);
    const [mafThreshold, setMafThreshold] = useState(0.01);

    const handleCovariateDelete = (remainingCovariates) => {
        const remainingCovArr = [];
        remainingCovariates.forEach((name) => {
            selectedCovariates.forEach((covObj) => {
                if (covObj.concept_name === name) {
                    remainingCovArr.push(covObj);
                }
            });
        });
        setSelectedCovariates(remainingCovArr);
        setSelectedCovariateVars(remainingCovArr.map((c) => c.concept_id));
        setSelectedCovariateIds(remainingCovArr.map((p) => p.prefixed_concept_id));
        form.setFieldsValue({
            covariates: remainingCovArr.map((val) => val.concept_name),
        });
    };
    return  (<Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
        <h4 className='GWASUI-selectInstruction'>In this step, you will determine workflow parameters. Please adjust the number of population principal components to control for population structure, minor allele frequency cutoff and imputation score cutoff.</h4>
        <h4 className='GWASUI-selectInstruction'>You may also remove unwanted covariates. Please also choose the ancestry population on which you would like to perform your study.</h4>
        <div className='GWASUI-mainArea GWASUI-form'>
            <div className="GWASUI-formItem">
                {/* value required (between 1 and 10) */}
                <label>Number of PCs to use</label>
                <InputNumber
                    value={numOfPC}
                    min={1}
                    max={10}
                    onChange={(e) => setNumOfPC(e)}
                />
            </div>
            <div className="GWASUI-formItem">
                <label>Covariates</label>
                <Select
                    mode='multiple'
                    value={selectedCovariates.map((s) => s.concept_name)}
                    disabled={selectedCovariates.length === 1}
                    onChange={(e) => handleCovariateDelete(e)}
                    style={{ width: '70%' }}
                />
            </div>
            <div className="GWASUI-formItem">
                {/* TODO: import this component & selection required */}
                <label>Select HARE group</label>
                {workflowType === 'caseControl' && (<CovariateStatsByHareCC selectedHare={selectedHare} caseCohortDefinitionId={caseCohortDefinitionId} controlCohortDefinitionId={controlCohortDefinitionId} selectedCovariates={selectedCovariates} selectedDichotomousCovariates={selectedDichotomousCovariates} sourceId={sourceId}/>)}
                {/* {workflowType === 'quantitative' && (<ConceptStatsByHareQ />)} */}
            </div>
            <div className="GWASUI-formItem">
                <label>MAF Cutoff</label>
                <InputNumber value={mafThreshold} onChange={(e) => setMafThreshold(e)} stringMode step='0.01' min={'0'} max={'0.5'} />
            </div >
            <div className="GWASUI-formItem">
                <label>Imputation Score Cutoff</label>
                <InputNumber value={imputationScore} onChange={(e) => setImputationScore(e)} stringMode step='0.1' min={'0'} max={'1'} /></div>
        </div>
    </Space >)
}

export default WorkflowParameters;
