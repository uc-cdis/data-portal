import React, { useReducer } from 'react';
import { Space, Button, Popconfirm } from 'antd';
import ProgressBar from './Components/ProgressBar/ProgressBar';
import { gwasV2Steps } from './Shared/constants';
import initialState from './Shared/StateManagement/InitialState';
import reducer from './Shared/StateManagement/reducer';
import ACTIONS from './Shared/StateManagement/Actions';
import AttritionTableWrapper from './Components/AttritionTableWrapper/AttritionTableWrapper';
import SelectStudyPopulation from './Steps/SelectStudyPopulation/SelectStudyPopulation';
import ConfigureGWAS from './Steps/ConfigureGWAS/ConfigureGWAS';
import SelectOutcome from './Steps/SelectOutcome/SelectOutcome';
import SelectCovariates from './Steps/SelectCovariates/SelectCovariates';
import './GWASV2.css';

const GWASContainer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const generateStep = () => {
    switch (state.currentStep) {
    case 0:
      return (
        <SelectStudyPopulation
          selectedCohort={state.selectedStudyPopulationCohort}
          dispatch={dispatch}
        />
      );
    case 1:
      return (
        <SelectOutcome
          studyPopulationCohort={state.selectedStudyPopulationCohort}
          outcome={state.outcome}
          dispatch={dispatch}
        />
      );
    case 2:
      return (
        <React.Fragment>
          <SelectCovariates
            studyPopulationCohort={state.selectedStudyPopulationCohort}
            outcome={state.outcome}
            covariates={state.covariates}
            dispatch={dispatch}
          />
        </React.Fragment>
      );
    case 3:
      return (
        <ConfigureGWAS
          dispatch={dispatch}
          numOfPCs={state.numPCs}
          mafThreshold={state.mafThreshold}
          imputationScore={state.imputationScore}
          selectedHare={state.selectedHare}
          covariates={state.covariates}
          selectedCohort={state.selectedStudyPopulationCohort}
          outcome={state.outcome}
          showModal={false}
        />
      );
    case 4:
      return (
        <ConfigureGWAS
          dispatch={dispatch}
          numOfPCs={state.numPCs}
          mafThreshold={state.mafThreshold}
          imputationScore={state.imputationScore}
          selectedHare={state.selectedHare}
          covariates={state.covariates}
          selectedCohort={state.selectedStudyPopulationCohort}
          outcome={state.outcome}
          showModal={true}
        />
      );
    default:
      return null;
    }
  };

  let nextButtonEnabled = true;
  if (state.currentStep === 0 && !state.selectedStudyPopulationCohort) {
    nextButtonEnabled = false;
  }

  /*
  todo:
  { outcome, allCovariates, numOfPCs, mafThreshold, imputationScore, ...} = workflow;
  grab submit code from GWASWizard/wizardEndpoints/gwasWorkflowApi.js

  const GWASSubmit = () => {
  };
  */

  return (
    <React.Fragment>
      <ProgressBar currentStep={state.currentStep} />
      <AttritionTableWrapper
        covariates={state.covariates}
        selectedCohort={state.selectedStudyPopulationCohort}
        outcome={state.outcome}
      />
      {/* Inline style block needed so centering rule doesn't impact other workflows */}
      <style>
        {'.analysis-app__actions > div:nth-child(1) { width: 100%; }'}
      </style>
      <div className='GWASV2'>
        <Space direction={'vertical'} style={{ width: '100%' }}>
          <div className='steps-content'>
            <Space
              direction={'vertical'}
              align={'center'}
              style={{ width: '100%' }}
            >
              {generateStep(state.currentStep)}
            </Space>
          </div>
          <div className='steps-action'>
            <Button
              className='GWASUI-navBtn GWASUI-navBtn__next'
              type='primary'
              onClick={() => {
                dispatch({ type: ACTIONS.DECREMENT_CURRENT_STEP });
              }}
              disabled={state.currentStep < 1}
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
            {state.currentStep < gwasV2Steps.length && (
              <Button
                data-tour='next-button'
                className='GWASUI-navBtn GWASUI-navBtn__next'
                type='primary'
                onClick={() => {
                  dispatch({ type: ACTIONS.INCREMENT_CURRENT_STEP });
                }}
                disabled={!nextButtonEnabled}
              >
                Next
              </Button>
            )}
            {state.currentStep === gwasV2Steps.length - 1 && (
              <div className='GWASUI-navBtn' />
            )}
          </div>
        </Space>
      </div>
    </React.Fragment>
  );
};

export default GWASContainer;
