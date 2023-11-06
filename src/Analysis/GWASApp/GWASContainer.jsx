import React, { useReducer } from 'react';
import { Space, Button } from 'antd';
import ProgressBar from './Components/ProgressBar/ProgressBar';
import { GWASAppSteps, checkFinalPopulationSizeZero } from './Utils/constants';
import { SourceContextProvider } from './Utils/Source';
import initialState from './Utils/StateManagement/InitialState';
import reducer from './Utils/StateManagement/reducer';
import ACTIONS from './Utils/StateManagement/Actions';
import AttritionTableWrapper from './Components/AttritionTableWrapper/AttritionTableWrapper';
import SelectStudyPopulation from './Steps/SelectStudyPopulation/SelectStudyPopulation';
import ConfigureGWAS from './Steps/ConfigureGWAS/ConfigureGWAS';
import SelectOutcome from './Steps/SelectOutcome/SelectOutcome';
import SelectCovariates from './Steps/SelectCovariates/SelectCovariates';
import DismissibleMessagesList from './Components/DismissibleMessagesList/DismissibleMessagesList';
import MakeFullscreenButton from './Components/MakeFullscreenButton/MakeFullscreenButton';
import './GWASApp.css';

const GWASContainer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const generateStep = () => {
    console.log('initialState', state);
    switch (state.currentStep) {
    case 0:
      return (
        <div data-tour='cohort-intro'>
          <SelectStudyPopulation
            selectedCohort={state.selectedStudyPopulationCohort}
            dispatch={dispatch}
          />
        </div>
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
          finalPopulationSizes={state.finalPopulationSizes}
          selectedTeamProject={state.selectedTeamProject}
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
          selectedTeamProject={state.selectedTeamProject}
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
    || (state.currentStep === 3
      && checkFinalPopulationSizeZero(state.finalPopulationSizes))
  ) {
    nextButtonEnabled = false;
  }

  return (
    <SourceContextProvider>
      <ProgressBar
        currentStep={state.currentStep}
        selectionMode={state.selectionMode}
      />
      <AttritionTableWrapper
        covariates={state.covariates}
        selectedCohort={state.selectedStudyPopulationCohort}
        outcome={state.outcome}
      />
      <DismissibleMessagesList
        messages={state.messages}
        dismissMessage={(chosenMessage) => {
          dispatch({
            type: ACTIONS.DELETE_MESSAGE,
            payload: chosenMessage,
          });
        }}
      />
      {/* Inline style block needed so centering rule doesn't impact other workflows */}
      <style>
        {'.analysis-app__actions > div:nth-child(1) { width: 100%; }'}
      </style>
      <div className='GWASApp'>
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
            {state.currentStep < GWASAppSteps.length && (
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
          <MakeFullscreenButton />
        </Space>
      </div>
    </SourceContextProvider>
  );
};

export default GWASContainer;
