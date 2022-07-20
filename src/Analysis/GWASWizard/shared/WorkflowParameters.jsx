import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Space, InputNumber, Select,
} from 'antd';
import '../../GWASUIApp/GWASUIApp.css';
import CovariateStatsByHareCC from '../CovariateStatsByHareCC';
// import CovariateStatsByHareQ from "../CovariateStatsByHareQ";

const WorkflowParameters = ({
    selectedHare,
    handleHareSelect,
    caseCohortDefinitionId,
    controlCohortDefinitionId,
    selectedCovariates,
    selectedDichotomousCovariates,
    sourceId,
    workflowType,
}) => {
    const [numOfPC, setNumOfPC] = useState(3);
    const [imputationScore, setImputationScore] = useState(0.3);
    const [mafThreshold, setMafThreshold] = useState(0.01);

    // const handleCovariateDelete = (remainingCovariates) => {
    //     const remainingCovArr = [];
    //     remainingCovariates.forEach((name) => {
    //         selectedCovariates.forEach((covObj) => {
    //             if (covObj.concept_name === name) {
    //                 remainingCovArr.push(covObj);
    //             }
    //         });
    //     });
    //     setSelectedCovariates(remainingCovArr);
    //     setSelectedCovariateVars(remainingCovArr.map((c) => c.concept_id));
    //     setSelectedCovariateIds(remainingCovArr.map((p) => p.prefixed_concept_id));
    // };
    return (
        <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
            <h4 className='GWASUI-selectInstruction'>
                In this step, you will determine workflow parameters.
                Please adjust the number of population principal components to control for population structure,
                minor allele frequency cutoff and imputation score cutoff.
            </h4>
            <h4 className='GWASUI-selectInstruction'>
                You may also remove unwanted covariates.
                Please also choose the ancestry population on which you would like to perform your study.
            </h4>
            <div className='GWASUI-mainArea GWASUI-form'>
                <div className='GWASUI-formItem'>
                    {/* value required (between 1 and 10) */}
                    <label htmlFor='input-numOfPC'>
                        <InputNumber
                            id='input-numOfPC'
                            value={numOfPC}
                            min={1}
                            max={10}
                            onChange={(e) => setNumOfPC(e)}
                        />
                        Number of PCs to use
                    </label>
                </div>
                <div className='GWASUI-formItem'>
                    <label htmlFor='select-covariates'>
                        <Select
                            id='select-covariates'
                            mode='multiple'
                            value={selectedCovariates.map((s) => s.concept_name)}
                            disabled={selectedCovariates.length === 1}
                            // onChange={(e) => handleCovariateDelete(e)}
                            style={{ width: '70%' }}
                        />
                        Covariates
                    </label>
                </div>
                <div className='GWASUI-formItem'>
                    {/* TODO: import this component & selection required */}
                    <label htmlFor='select-hare-case-control'>
                        {workflowType === 'caseControl' && (
                            <CovariateStatsByHareCC
                                id='select-hare-case-control'
                                selectedHare={selectedHare}
                                caseCohortDefinitionId={caseCohortDefinitionId}
                                controlCohortDefinitionId={controlCohortDefinitionId}
                                selectedCovariates={selectedCovariates}
                                selectedDichotomousCovariates={selectedDichotomousCovariates}
                                sourceId={sourceId}
                                handleHareSelect={handleHareSelect}
                            />
                        )}
                        Select HARE group
                    </label>
                    {/* {workflowType === 'quantitative' && (<ConceptStatsByHareQ />)} */}
                </div>
                <div className='GWASUI-formItem'>
                    <label htmlFor='input-maf'>
                        <InputNumber
                            id='input-maf'
                            value={mafThreshold}
                            onChange={(e) => setMafThreshold(e)}
                            stringMode
                            step='0.01'
                            min={'0'}
                            max={'0.5'}
                        />
                        MAF Cutoff
                    </label>
                </div>
                <div className='GWASUI-formItem'>
                    <label htmlFor='input-imputation'>
                        <InputNumber
                            id='input-imputation'
                            value={imputationScore}
                            onChange={(e) => setImputationScore(e)}
                            stringMode
                            step='0.1'
                            min={'0'}
                            max={'1'}
                        />
                        Imputation Score Cutoff
                    </label>
                </div>
            </div>
        </Space>
    );
};

WorkflowParameters.propTypes = {
    selectedHare: PropTypes.string.isRequired,
    handleHareSelect: PropTypes.func.isRequired,
    caseCohortDefinitionId: PropTypes.number.isRequired,
    controlCohortDefinitionId: PropTypes.number.isRequired,
    selectedCovariates: PropTypes.array.isRequired,
    selectedDichotomousCovariates: PropTypes.array.isRequired,
    sourceId: PropTypes.number.isRequired,
    workflowType: PropTypes.string.isRequired,
};

export default WorkflowParameters;
