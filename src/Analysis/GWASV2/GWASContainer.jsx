import React, { useReducer } from 'react';
import { Space, Button, Popconfirm } from 'antd';
import CohortSelect from './CohortSelect/CohortSelect';
import SelectOutcome from './SelectOutcome/SelectOutcome';
import SelectCovariates from './SelectCovariates/SelectCovariates';
import CovariatesCardsList from './Shared/Covariates/CovariatesCardsList';
import ProgressBar from './Shared/ProgressBar/ProgressBar';
import ConfigureGWAS from './ConfigureGWAS/ConfigureGWAS';
import { gwasV2Steps, initialState } from './Shared/constants';
// import AttritionTableWrapper from './Shared/AttritionTableWrapper/AttritionTableWrapper';
import './GWASV2.css';

const GWASContainer = () => {
  const reducer = (state, action) => {
    const { accessor, payload } = action;
    return {
      ...state,
      [accessor]: payload
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const { outcome,
    selectedStudyPopulationCohort,
    covariates,
    imputationScore,
    mafThreshold,
    numOfPC,
    gwasName,
    selectedHare,
    currentStep } = state;

  const generateStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div
            style={{ width: '80%', margin: 'auto', height: '500px' }}
          >
            <CohortSelect
              selectedCohort={selectedStudyPopulationCohort}
              handleCohortSelect={dispatch}
              namespace={'selectedStudyPopulationCohort'}
            />
          </div>
        );
      case 1:
        return (
          <div style={{ width: 'inherit' }} >
              <SelectOutcome
                outcome={outcome}
                covariates={covariates}
                dispatch={dispatch}
              />
            </div>
        );
      case 2:
        return (
          <React.Fragment>
            <SelectCovariates
              outcome={outcome}
              covariates={covariates}
              dispatch={dispatch}
            />
            <CovariatesCardsList
              covariates={covariates}
              dispatch={dispatch}
            />
          </React.Fragment>
        );
      case 3:
        return (
          <ConfigureGWAS
            dispatch={dispatch}
            numOfPCs={numOfPC}
            mafThreshold={mafThreshold}
            imputationScore={imputationScore}
            selectedHare={selectedHare}
          />
        );
      default:
        return null;
    }
  };

  /*
  todo:
  { outcome, allCovariates, numOfPCs, mafThreshold, imputationScore, ...} = workflow;
  grab submit code from GWASWizard/wizardEndpoints/gwasWorkflowApi.js

  const GWASSubmit = () => {
  };
  */
  let nextButtonEnabled = true;
  if (
    currentStep === 0
    && Object.keys(selectedStudyPopulationCohort).length === 0
  ) {
    nextButtonEnabled = false;
  }

  return (
    <React.Fragment>
      <ProgressBar currentStep={currentStep} />
      {/* <AttritionTableWrapper
        covariates={covariates}
        selectedCohort={selectedStudyPopulationCohort}
        outcome={outcome}
      /> */}
      {/* Inline style block needed so centering rule doesn't impact other workflows */}
      {/* <style>
        {'.analysis-app__actions > div:nth-child(1) { width: 100%; }'}
      </style> */}
      <div className='GWASV2'>
        <Space direction={'vertical'} style={{ width: '100%' }}>
          <div className='steps-content'>
            <Space
              direction={'vertical'}
              align={'center'}
              style={{ width: '100%' }}
            >
              <div style={{
                width: '95vw',
                height: 'fit-content'
              }}>
                {generateStep(currentStep)}
              </div>
            </Space>
          </div>
          <div className='steps-action'>
            <Button
              className='GWASUI-navBtn GWASUI-navBtn__next'
              type='primary'
              onClick={() => {
                dispatch({ accessor: "currentStep", payload: currentStep - 1 });
              }}
              disabled={currentStep < 1}
            >
              Previous
            </Button>
            <Popconfirm
              title='Are you sure you want to leave this page?'
              //   onConfirm={() => resetGWASType()}
              okText='Yes'
              cancelText='No'
            >
              <Button type='link' size='medium'>
                Select Different GWAS Type
              </Button>
            </Popconfirm>
            {currentStep < gwasV2Steps.length - 1 && (
              <Button
                data-tour='next-button'
                className='GWASUI-navBtn GWASUI-navBtn__next'
                type='primary'
                onClick={() => {
                  dispatch({ accessor: "currentStep", payload: currentStep + 1 });
                }}
                disabled={!nextButtonEnabled}
              >
                Next
              </Button>
            )}
            {currentStep === gwasV2Steps.length - 1 && (
              <div className='GWASUI-navBtn' />
            )}
          </div>
        </Space>
      </div>
    </React.Fragment>
  );
};

export default GWASContainer;
