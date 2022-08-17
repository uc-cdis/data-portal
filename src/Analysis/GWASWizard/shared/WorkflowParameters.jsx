import React from 'react';
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
  handleCovariateDelete,
  outcomeId,
}) => (
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
      <div className='GWASUI-formItem' data-tour='number-of-pcs'>
        <span style={{ color: 'red' }}>*</span>Number of PCs to use &nbsp;
        <label htmlFor='input-numOfPC'>
          <InputNumber
            id='input-numOfPC'
            value={numOfPC}
            min={1}
            max={10}
            onChange={(e) => handleNumOfPC(e)}
          />
          {(!numOfPC) && (<span style={{ color: 'red' }}> Please input a value between 1 and 10</span>)}
        </label>
      </div>
      <div className='GWASUI-formItem' data-tour='covariates'>
        <label htmlFor='select-covariates'>
          Covariates &nbsp;
          <Select
            id='select-covariates'
            mode='multiple'
            value={
              outcomeId ? selectedCovariates.filter((covs) => covs.concept_id !== outcomeId).map((s) => s.concept_name)
                : selectedCovariates.map((s) => s.concept_name)
            }
            disabled={selectedCovariates.length === 1}
            onChange={(e) => handleCovariateDelete(e)}
            style={{ width: '70%' }}
          />
        </label>
      </div>
      <div className='GWASUI-formItem'>
        <label htmlFor='select-dichotomous-covariates'>
          Dichotomous Covariates &nbsp;
          <Select
            id='select-dichotomous-covariates'
            mode='multiple'
            value={selectedDichotomousCovariates.length ? selectedDichotomousCovariates.map((s) => s.provided_name) : []}
            // TODO currently cant delete cd's from this page
            // onChange={(e) => handleDichotomousCovariateDelete(e)}
            style={{ width: '70%' }}
          />
        </label>
      </div>
      <div className='GWASUI-formItem' data-tour='hare'>
        {workflowType === 'caseControl' && (
          <label htmlFor='select-hare-case-control'>
            <span style={{ color: 'red' }}>*</span>
            Select HARE group &nbsp;
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
            <span style={{ color: 'red' }}>*</span>
            Select HARE group &nbsp;
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
      <div className='GWASUI-formItem' data-tour='maf-cutoff'>
        <label htmlFor='input-maf'>
          MAF Cutoff &nbsp;
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
      <div className='GWASUI-formItem' data-tour='imputation-score'>
        <label htmlFor='input-imputation'>
          Imputation Score Cutoff &nbsp;
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
  caseCohortDefinitionId: PropTypes.number,
  controlCohortDefinitionId: PropTypes.number,
  quantitativeCohortDefinitionId: PropTypes.number,
  selectedCovariates: PropTypes.array.isRequired,
  selectedDichotomousCovariates: PropTypes.array.isRequired,
  sourceId: PropTypes.number.isRequired,
  workflowType: PropTypes.string.isRequired,
  imputationScore: PropTypes.number.isRequired,
  handleImputation: PropTypes.func.isRequired,
  mafThreshold: PropTypes.number.isRequired,
  handleMaf: PropTypes.func.isRequired,
  numOfPC: PropTypes.number.isRequired,
  handleNumOfPC: PropTypes.func.isRequired,
  handleCovariateDelete: PropTypes.func.isRequired,
  outcomeId: PropTypes.number,
};

WorkflowParameters.defaultProps = {
  controlCohortDefinitionId: undefined,
  caseCohortDefinitionId: undefined,
  quantitativeCohortDefinitionId: undefined,
  outcomeId: undefined,
};

export default WorkflowParameters;
