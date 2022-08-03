import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Steps, Button, Space, Popconfirm, Spin,
} from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from 'react-query';
import CohortSelect from './shared/CohortSelect';
import CovariateSelect from './shared/CovariateSelect';
import CustomDichotomousSelect from './shared/CustomDichotomousSelect';
import { caseControlSteps } from './shared/constants';
import { useSourceFetch } from './wizard-endpoints/cohort-middleware-api';
import '../GWASUIApp/GWASUIApp.css';
import AddCohortButton from './shared/AddCohortButton';
import CovariateReview from './CovariateReview';
import WorkflowParameters from './shared/WorkflowParameters';
import GWASFormSubmit from './shared/GWASFormSubmit';

const { Step } = Steps;

const GWASCaseControl = ({ resetGWASType, refreshWorkflows }) => {
  const [current, setCurrent] = useState(0);
  const [selectedCaseCohort, setSelectedCaseCohort] = useState(undefined);
  const [selectedControlCohort, setSelectedControlCohort] = useState(undefined);
  const [selectedCovariates, setSelectedCovariates] = useState([]);
  const [selectedDichotomousCovariates, setSelectedDichotomousCovariates] = useState([]);
  const [selectedHare, setSelectedHare] = useState({ concept_value: '' });
  const [numOfPC, setNumOfPC] = useState(3);
  const [imputationScore, setImputationScore] = useState(0.3);
  const [mafThreshold, setMafThreshold] = useState(0.01);
  const [gwasName, setGwasName] = useState('');

  const { loading, sourceId } = useSourceFetch();

  const handleCaseCohortSelect = (cohort) => {
    setSelectedCaseCohort(cohort);
  };
  const handleControlCohortSelect = (cohort) => {
    setSelectedControlCohort(cohort);
  };

  const handleCovariateSelect = (cov) => {
    setSelectedCovariates(cov);
  };

  const handleCDAdd = (cd) => {
    setSelectedDichotomousCovariates((prevCDArr) => [...prevCDArr, cd]);
  };

  const handleHareChange = (hare) => {
    console.log('hare', hare);
    setSelectedHare(hare);
  };

  const handleGwasNameChange = (e) => {
    setGwasName(e.target.value);
  };

  const handleNumOfPC = (num) => {
    setNumOfPC(num);
  };

  const handleMaf = (maf) => {
    setMafThreshold(maf);
  };

  const handleImputation = (imp) => {
    setImputationScore(imp);
  };

  const resetGWAS = () => {
    // TODO reset to initial state
    refreshWorkflows();
  };

  const generateStep = () => {
    switch (current) {
    case 0:
      return (!loading && sourceId ? (
        <React.Fragment>
          <AddCohortButton />
          <React.Fragment>
            <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
              <h4 className='GWASUI-selectInstruction'>In this step, you will determine the study population. To begin, select the cohort that you would like to define your study population with.</h4>
              <div className='GWASUI-mainTable'>
                <CohortSelect
                  selectedCohort={selectedCaseCohort}
                  handleCohortSelect={handleCaseCohortSelect}
                  sourceId={sourceId}
                  current={current}
                />
              </div>
            </Space>
          </React.Fragment>
        </React.Fragment>
      ) : <Spin />);
    case 1:
      return (
        <React.Fragment>
          <AddCohortButton />
          <React.Fragment>
            <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
              <h4 className='GWASUI-selectInstruction'>In this step, you will continue to define the study population. Please select the cohort that you would like to define as your study “control” population.</h4>
              <div className='GWASUI-mainTable'>
                <CohortSelect
                  selectedCohort={selectedControlCohort}
                  handleCohortSelect={handleControlCohortSelect}
                  sourceId={sourceId}
                  otherCohortSelected={selectedCaseCohort ? selectedCaseCohort.cohort_name : ''}
                  current={current}
                />
              </div>
            </Space>
          </React.Fragment>
        </React.Fragment>
      );
    case 2:
      return (
        <React.Fragment>
          <React.Fragment>
            <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
              <h4 className='GWASUI-selectInstruction'>In this step, you will select the harmonized variables for your study. Please select all variables you wish to use in your model, including both covariates and phenotype. (Note: population PCs are not included in this step)</h4>
              <div className='GWASUI-mainTable'>
                <CovariateSelect
                  selectedCovariates={selectedCovariates}
                  handleCovariateSelect={handleCovariateSelect}
                  sourceId={sourceId}
                  current={current}
                />
              </div>
            </Space>
          </React.Fragment>
        </React.Fragment>
      );
    case 3:
      return (
        <React.Fragment>
          <CovariateReview
            caseCohortDefinitionId={selectedCaseCohort.cohort_definition_id}
            controlCohortDefinitionId={selectedControlCohort.cohort_definition_id}
            selectedCovariates={selectedCovariates}
            sourceId={sourceId}
          />
        </React.Fragment>
      );
    case 4:
      return (
        <React.Fragment>
          <CustomDichotomousSelect
            sourceId={sourceId}
            handleCDAdd={handleCDAdd}
            selectedDichotomousCovariates={selectedDichotomousCovariates}
            current={current}
          />
        </React.Fragment>
      );
    case 5:
      return (
        <React.Fragment>
          <WorkflowParameters
            caseCohortDefinitionId={selectedCaseCohort.cohort_definition_id}
            controlCohortDefinitionId={selectedControlCohort.cohort_definition_id}
            selectedCovariates={selectedCovariates}
            selectedDichotomousCovariates={selectedDichotomousCovariates}
            sourceId={sourceId}
            workflowType={'caseControl'}
            numOfPC={numOfPC}
            handleNumOfPC={handleNumOfPC}
            mafThreshold={mafThreshold}
            handleMaf={handleMaf}
            imputationScore={imputationScore}
            handleImputation={handleImputation}
            selectedHare={selectedHare}
            handleHareChange={handleHareChange}
          />
        </React.Fragment>
      );
    case 6:
      return (
        <React.Fragment>
          <h4 className='GWASUI-selectInstruction'>In this step, you may review the metadata selected for the study, give a name to the study, and submit the GWAS for analysis.</h4>
          <h4 className='GWASUI-selectInstruction'>Upon submission you may review the status of the job in the ‘Submitted Job Status’ in this App above the enumerated steps</h4>
          <div className='GWASUI-mainArea'>
            <GWASFormSubmit
              sourceId={sourceId}
              numOfPC={numOfPC}
              mafThreshold={mafThreshold}
              imputationScore={imputationScore}
              selectedHare={selectedHare}
              selectedCaseCohort={selectedCaseCohort}
              selectedControlCohort={selectedControlCohort}
              selectedCovariates={selectedCovariates}
              selectedDichotomousCovariates={selectedDichotomousCovariates}
              gwasName={gwasName}
              handleGwasNameChange={handleGwasNameChange}
              resetGWAS={resetGWAS}
            />
          </div>
        </React.Fragment>

      );
    }
  };

  let nextButtonEnabled = true;
  if ((current === 0 && !selectedCaseCohort) || (current === 1 && !selectedControlCohort)) {
    // Cohort selection
    nextButtonEnabled = false;
  } else if (current === 2 && selectedCovariates.length < 1) {
    // covariate selection
    nextButtonEnabled = false;
  }
  // else if (current === 4) {
  //     nextButtonEnabled = selectedHare != '' && numOfPC && numOfPC != '';
  // }

  return (
    <React.Fragment>
      <Space direction={'vertical'} style={{ width: '100%' }}>
        <Steps current={current}>
          {caseControlSteps.map((item) => (
            <Step key={item.title} title={item.title} description={item.description} />
          ))}
        </Steps>
        <div className='steps-content'>
          <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
            {generateStep(current)}
          </Space>
        </div>
        <div className='steps-action'>
          <Button
            className='GWASUI-navBtn GWASUI-navBtn__prev'
            disabled={current === 0}
            onClick={() => {
              setCurrent(current - 1);
            }}
          >
            Previous
          </Button>
          <Popconfirm
            title='Are you sure you want to leave this page?'
            onConfirm={() => resetGWASType()}
            okText='Yes'
            cancelText='No'
          >
            <Button type='link' size='medium' ghost>Select Different GWAS Type</Button>
          </Popconfirm>
          {current < caseControlSteps.length - 1 && (
            <Button
              className='GWASUI-navBtn GWASUI-navBtn__next'
              type='primary'
              onClick={() => {
                setCurrent(current + 1);
              }}
              disabled={!nextButtonEnabled}
            >
              Next
            </Button>
          )}
          {/* added so "select diff gwas" btn retains center position on last page */}
          {current === caseControlSteps.length - 1 && (<div className='GWASUI-navBtn' />)}
        </div>
      </Space>
    </React.Fragment>
  );
};

GWASCaseControl.propTypes = {
  refreshWorkflows: PropTypes.func.isRequired,
  resetGWASType: PropTypes.func.isRequired,
};

export default GWASCaseControl;
