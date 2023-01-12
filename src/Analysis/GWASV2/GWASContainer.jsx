import React, { useReducer, useState } from 'react';
import { Space, Button } from 'antd';
import ProgressBar from './Components/ProgressBar/ProgressBar';
import { gwasV2Steps } from './Utils/constants';
import { SourceContextProvider } from './Utils/Source';
import initialState from './Utils/StateManagement/InitialState';
import reducer from './Utils/StateManagement/reducer';
import ACTIONS from './Utils/StateManagement/Actions';
import AttritionTableWrapper from './Components/AttritionTableWrapper/AttritionTableWrapper';
import SelectStudyPopulation from './Steps/SelectStudyPopulation/SelectStudyPopulation';
import ConfigureGWAS from './Steps/ConfigureGWAS/ConfigureGWAS';
import SelectOutcome from './Steps/SelectOutcome/SelectOutcome';
import SelectCovariates from './Steps/SelectCovariates/SelectCovariates';
import { useTour } from '@reactour/tour';
import './GWASV2.css';

const GWASContainer = () => {
  const { setIsOpen } = useTour();
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
          covariates={state.covariates}
          dispatch={dispatch}
        />
      );
    case 2:
      return (
        <SelectCovariates
          studyPopulationCohort={state.selectedStudyPopulationCohort}
          outcome={state.outcome}
          covariates={state.covariates}
          dispatch={dispatch}
        />
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
          showModal
          finalPopulationSizes={state.finalPopulationSizes}
        />
      );
    default:
      return null;
    }
  };

  let nextButtonEnabled = true;
  // step specific conditions where progress to next step needs to be blocked:
  if (
    (state.currentStep === 0 && !state.selectedStudyPopulationCohort)
    || (state.currentStep === 1 && !state.outcome)
    || (state.currentStep === 3 && !state.selectedHare.concept_value)
  ) {
    nextButtonEnabled = false;
  }

  return (
    <SourceContextProvider>
      <p className="first-step">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at
        finibus nulla, quis varius justo. Vestibulum lorem lorem, viverra porta
        metus nec, porta luctus orci
      </p>
      <button onClick={() => setIsOpen(true)}>Open Tour</button>
     
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
        <Space direction={'vertical'} className='steps-wrapper'>
          <div className='steps-content'>
            <Space direction={'vertical'} align={'center'}>
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
            {/* If user is on the last step, do not show the next button */}
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
          </div>
        </Space>
      </div>
    </SourceContextProvider>
  );
};

export default GWASContainer;
