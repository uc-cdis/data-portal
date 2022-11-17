import React, { useState, useReducer, useContext, useEffect } from 'react';
import { Space, Button, Popconfirm, Spin } from 'antd';
import StudyPopulationCohortSelect from './SelectStudyPopulation/Utils/StudyPopulationCohortSelect';
import SelectOutcome from "./SelectOutcome/SelectOutcome";
import SelectCovariates from "./SelectCovariates/SelectCovariates";
import CovariatesCardsList from "./Shared/Covariates/CovariatesCardsList";
import ProgressBar from './Shared/ProgressBar/ProgressBar';
import ConfigureGWAS from './ConfigureGWAS/ConfigureGWAS';
// import AttritionTable from './Shared/AttritionTable/AttritionTable';
import { gwasV2Steps, initialWorkflow } from './Shared/constants';
import './GWASV2.css';

const GWASContainer = () => {
  const reducer = (gwas, action) => {
    const { keyName, newValue, op = "" } = action;
    switch (typeof keyName) { // in some cases keyName is really a list of names!!?? Should we call this keyNames?? TODO - change to make this always a list
      case "object": {
        const mutation = { ...gwas };
        keyName.forEach((s) => {
          mutation[s] = newValue[keyName.indexOf(s)]
        })
        return mutation
      }
      case "string":
        switch (keyName) {
          case "covariates":
            const { covariates } = gwas;
            switch (op) {
              case "+":
                return {
                  ...gwas,
                  [keyName]: [...covariates, newValue]
                }
              case "-":
                console.log('delete newValue', newValue) // <-- pass newValue as an id always so you dont have to check
                                                     // custom dichotomous vs continuous being deleted
                return {
                  ...gwas,          // newValue should contain what type of cov being deleted to make this reducer fitler cleaner
                  [keyName]: [...covariates.filter((c) => /* ... */ c), newValue]
                }
            }

          default:
            return {
              ...gwas,
              [keyName]: newValue
            }
        }
    }
  }

  // todo need better naming
  const [workflow, setWorkflow] = useReducer(reducer, initialWorkflow);

  const {
    selectedStudyPopulationCohort,
    outcome,
    covariates,
    imputationScore,
    numPCs,
    mafThreshold,
    selectedHare,
    current
  } = workflow;

  const generateStep = () => {
    switch (current) {
      case 0:
        return (
          <StudyPopulationCohortSelect
            selectedStudyPopulationCohort={selectedStudyPopulationCohort}
            handleStudyPopulationCohortSelect={setWorkflow}
            cd={false}
          />
        );
      case 1:
        return <>
          <SelectOutcome
            outcome={outcome}
            covariates={covariates}
            handleOutcome={setWorkflow}
          />
        </>
      case 2:
        return <>
          <SelectCovariates
            outcome={{}}
            covariates={covariates}
            handleCovariateSubmit={setWorkflow}
          />
          <CovariatesCardsList
            covariates={covariates}
            setWorkflow={setWorkflow}
           />
        </>;
      case 3:
        return <>
          <ConfigureGWAS
            setWorkflow={setWorkflow}
            numOfPCs={numPCs}
            mafThreshold={mafThreshold}
            imputationScore={imputationScore}
            selectedHare={selectedHare}
            />
            </>;
      default:
        return null;
    }
  };

  let nextButtonEnabled = true;
  if (
    current === 0
    && Object.keys(selectedStudyPopulationCohort).length === 0
  ) {
    nextButtonEnabled = false;
  }

  const GWASSubmit = ()  => {
    // todo:
    // { outcome, allCovariates, numOfPCs, mafThreshold, imputationScore, ...} = workflow;
    // grab submit code from GWASWizard/wizardEndpoints/gwasWorkflowApi.js
  }

  return (
    <React.Fragment>
      <span>the current outcome is {workflow.outcome.concept_name ?? 'nada'}</span>
      <ProgressBar current={current} />
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
              {generateStep(current)}
            </Space>
          </div>
          <div className='steps-action'>
            <Button
              className='GWASUI-navBtn GWASUI-navBtn__next'
              type='primary'
              onClick={() => {
                setWorkflow({ keyName: "current", newValue: current - 1 });
              }}
              disabled={current < 1}
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
            {current < gwasV2Steps.length - 1 && (
              <Button
                data-tour='next-button'
                className='GWASUI-navBtn GWASUI-navBtn__next'
                type='primary'
                onClick={() => {
                  setWorkflow({ keyName: "current", newValue: current + 1 });
                }}
                disabled={!nextButtonEnabled}
              >
                Next
              </Button>
            )}
            {current === gwasV2Steps.length - 1 && (
              <div className='GWASUI-navBtn' />
            )}
          </div>
        </Space>
      </div>
    </React.Fragment>
  );
};

export default GWASContainer;
