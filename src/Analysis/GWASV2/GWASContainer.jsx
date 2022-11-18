import React, { useState, useReducer, useContext, useEffect } from 'react';
import { Space, Button, Popconfirm, Spin } from 'antd';
import StudyPopulationCohortSelect from './SelectStudyPopulation/Utils/StudyPopulationCohortSelect';
import SelectOutcome from './SelectOutcome/SelectOutcome';
import SelectCovariates from './SelectCovariates/SelectCovariates';
import CovariatesCardsList from './Shared/Covariates/CovariatesCardsList';
import ProgressBar from './Shared/ProgressBar/ProgressBar';
import ConfigureGWAS from './ConfigureGWAS/ConfigureGWAS';
// import AttritionTable from './Shared/AttritionTable/AttritionTable';
import { gwasV2Steps, initialState, ACTIONS } from './Shared/constants';
import './GWASV2.css';

const GWASContainer = () => {
  const reducer = (state, action) => {
    console.log('called Reducer with:', state, 'and ', action);
    switch (action.type) {
      case ACTIONS.SET_SELECTED_STUDY_POPULATION_COHORT:
        return { ...state, selectedStudyPopulationCohort: action.payload };
      case ACTIONS.INCREMENT_CURRENT:
        return { ...state, current: state.current + 1 };
      case ACTIONS.DECREMENT_CURRENT:
        return { ...state, current: state.current - 1 };
      case ACTIONS.SET_OUTCOME:
        return { ...state, current: 2, outcome: action.payload };
      case ACTIONS.ADD_COVARIATE:
        return { ...state, covariates: [...state.covariates, action.payload] };
      case ACTIONS.DELETE_CONTINUOUS_COVARIATE:
        return {
          ...state,
          covariates: state.covariates.filter((covariate) => {
            return covariate.concept_id !== action.payload;
          }),
        };
      case ACTIONS.DELETE_DICHOTOMOUS_COVARIATE:
        return {
          ...state,
          covariates: state.covariates.filter((covariate) => {
            return covariate.provided_name !== action.payload;
          }),
        };
      case ACTIONS.UPDATE_IMPUTATION_SCORE:
        return { ...state, imputationScore: action.payload };
      case ACTIONS.UPDATE_MAF_THRESHOLD:
        return { ...state, mafThreshold: action.payload };
      case ACTIONS.UPDATE_NUM_PCS:
        return { ...state, numPCs: action.payload };
      default:
        throw new Error('Unknown action passed to reducer');
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const generateStep = () => {
    switch (state.current) {
      case 0:
        return (
          <StudyPopulationCohortSelect
            selectedStudyPopulationCohort={state.selectedStudyPopulationCohort}
            handleStudyPopulationCohortSelect={dispatch}
            dispatch={dispatch}
            cd={false}
          />
        );
      case 1:
        return (
          <SelectOutcome
            outcome={state.outcome}
            covariates={state.covariates}
            dispatch={dispatch}
          />
        );
      case 2:
        return (
          <>
            <SelectCovariates
              outcome={{}}
              covariates={state.covariates}
              dispatch={dispatch}
            />
            <CovariatesCardsList
              covariates={state.covariates}
              dispatch={dispatch}
            />
          </>
        );
      case 3:
        return (
          <ConfigureGWAS
            dispatch={dispatch}
            numOfPCs={state.numPCs}
            mafThreshold={state.mafThreshold}
            imputationScore={state.imputationScore}
            selectedHare={state.selectedHare}
          />
        );
      default:
        return null;
    }
  };

  let nextButtonEnabled = true;
  if (
    state.current === 0 &&
    Object.keys(state.selectedStudyPopulationCohort).length === 0
  ) {
    nextButtonEnabled = false;
  }

  const GWASSubmit = () => {
    // todo:
    // { outcome, allCovariates, numOfPCs, mafThreshold, imputationScore, ...} = workflow;
    // grab submit code from GWASWizard/wizardEndpoints/gwasWorkflowApi.js
  };

  return (
    <React.Fragment>
      <span>the current outcome is {state.outcome.concept_name ?? 'nada'}</span>
      <ProgressBar current={state.current} />
      {/* {!loading && sourceId && (
        <React.Fragment>
          <AttritionTable
            sourceId={sourceId}
            selectedCohort={selectedStudyPopulationCohort}
            otherSelectedCohort={selectedControlCohort}
            // outcome={outcome}
            selectedCovariates={selectedCovariates}
            selectedDichotomousCovariates={selectedDichotomousCovariates}
            tableHeader={'Case Cohort Attrition Table'}
          />
          <AttritionTable
            sourceId={sourceId}
            selectedCohort={selectedControlCohort}
            otherSelectedCohort={selectedCaseCohort}
            // outcome={outcome}
            selectedCovariates={selectedCovariates}
            selectedDichotomousCovariates={selectedDichotomousCovariates}
            tableHeader={'Control Cohort Attrition Table'}
          />
        </React.Fragment>
      )} */}
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
              {generateStep(state.current)}
            </Space>
          </div>
          <div className='steps-action'>
            <Button
              className='GWASUI-navBtn GWASUI-navBtn__next'
              type='primary'
              onClick={() => {
                dispatch({ type: ACTIONS.DECREMENT_CURRENT });
              }}
              disabled={state.current < 1}
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
            {state.current < gwasV2Steps.length - 1 && (
              <Button
                data-tour='next-button'
                className='GWASUI-navBtn GWASUI-navBtn__next'
                type='primary'
                onClick={() => {
                  dispatch({ type: ACTIONS.INCREMENT_CURRENT });
                }}
                disabled={!nextButtonEnabled}
              >
                Next
              </Button>
            )}
            {state.current === gwasV2Steps.length - 1 && (
              <div className='GWASUI-navBtn' />
            )}
          </div>
        </Space>
      </div>
    </React.Fragment>
  );
};

export default GWASContainer;
