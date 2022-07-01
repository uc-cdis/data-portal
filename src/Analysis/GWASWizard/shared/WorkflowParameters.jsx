import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Space, InputNumber, Select,
} from 'antd';
import '../../GWASUIApp/GWASUIApp.css';
import CovariateStatsByHareCC from '../CovariateStatsByHareCC';
import CovariateStatsByHareQ from '../CovariateStatsByHareQ';

const WorkflowParameters = ({
  selectedHare,
  handleHareChange,
  caseCohortDefinitionId,
  controlCohortDefinitionId,
  quantitativeCohortDefinitionId,
  selectedCovariates,
  selectedDichotomousCovariates,
  sourceId,
  workflowType,
  numOfPC,
  handleNumOfPC,
  mafThreshold,
  handleMaf,
  imputationScore,
  handleImputation,
}) =>

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
  (
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
      <div className='GWASUI-formItem' data-tour="number-of-pcs">
        {/* value required (between 1 and 10) */}
        <span style={{color: 'red'}}>*</span>Number of PCs to use
        <label htmlFor='input-numOfPC'>
          <InputNumber
            id='input-numOfPC'
            value={numOfPC}
            min={1}
            max={10}
            onChange={(e) => handleNumOfPC(e)}
          />
          {(!numOfPC) && (<span style={{color: 'red'}}> Please input a value between 1 and 10</span>)}
        </label>
      </div>
      <div className='GWASUI-formItem' data-tour="covariates">
        <label htmlFor='select-covariates'>
          Covariates
          <Select
            id='select-covariates'
            mode='multiple'
            value={selectedCovariates.map((s) => s.concept_name)}
            disabled={selectedCovariates.length === 1}
            // onChange={(e) => handleCovariateDelete(e)}
            style={{ width: '70%' }}
          />
        </label>
      </div>
      <div className='GWASUI-formItem'>
        <label htmlFor='select-dichotomous-covariates'>
          Dichotomous Covariates
          <Select
            id='select-dichotomous-covariates'
            mode='multiple'
            value={selectedDichotomousCovariates.map((s) => s.provided_name)}
            // onChange={(e) => handleDichotomousCovariateDelete(e)}
            style={{ width: '70%' }}
          />
        </label>
      </div>
      <div className='GWASUI-formItem' data-tour="hare">
        {workflowType === 'caseControl' && (
          <label htmlFor='select-hare-case-control'>
            <span style={{color: 'red'}}>*</span>
            Select HARE group
            <CovariateStatsByHareCC
              id='select-hare-case-control'
              selectedHare={selectedHare}
              caseCohortDefinitionId={caseCohortDefinitionId}
              controlCohortDefinitionId={controlCohortDefinitionId}
              selectedCovariates={selectedCovariates}
              selectedDichotomousCovariates={selectedDichotomousCovariates}
              sourceId={sourceId}
              handleHareChange={handleHareChange}
            />
          </label>
        )}
        {workflowType === 'quantitative' && (
          <label htmlFor='select-hare-quantitative'>
            <span style={{color: 'red'}}>*</span>
            Select HARE group
            <CovariateStatsByHareQ
              id='select-hare-quantitative'
              selectedHare={selectedHare}
              quantitativeCohortDefinitionId={quantitativeCohortDefinitionId}
              selectedCovariates={selectedCovariates}
              selectedDichotomousCovariates={selectedDichotomousCovariates}
              sourceId={sourceId}
              handleHareChange={handleHareChange}
            />

          </label>
        )}
      </div>
      <div className='GWASUI-formItem' data-tour="maf-cutoff">
        <label htmlFor='input-maf'>
          MAF Cutoff
          <InputNumber
            id='input-maf'
            value={mafThreshold}
            onChange={(e) => handleMaf(Number(e))}
            stringMode
            step='0.01'
            min={'0'}
            max={'0.5'}
          />
        </label>
      </div>
      <div className='GWASUI-formItem' data-tour="imputation-score">
        <label htmlFor='input-imputation'>
          Imputation Score Cutoff
          <InputNumber
            id='input-imputation'
            value={imputationScore}
            onChange={(e) => handleImputation(Number(e))}
            stringMode
            step='0.1'
            min={'0'}
            max={'1'}
          />
        </label>
      </div>
    </div>
  </Space>
);
WorkflowParameters.propTypes = {
  selectedHare: PropTypes.object.isRequired,
  handleHareChange: PropTypes.func.isRequired,
  caseCohortDefinitionId: PropTypes.number || undefined,
  controlCohortDefinitionId: PropTypes.number || undefined,
  quantitativeCohortDefinitionId: PropTypes.number || undefined,
  selectedCovariates: PropTypes.array.isRequired,
  selectedDichotomousCovariates: PropTypes.array.isRequired,
  sourceId: PropTypes.number.isRequired,
  workflowType: PropTypes.string.isRequired,
  handleImputation: PropTypes.func.isRequired,
  handleMaf: PropTypes.func.isRequired,
  handleNumOfPC: PropTypes.func.isRequired,
};

WorkflowParameters.defaultPropTypes = {
  controlCohortDefinitionId: undefined,
  caseCohortDefinitionId: undefined,
  quantitativeCohortDefinitionId: undefined,
};

export default WorkflowParameters;
