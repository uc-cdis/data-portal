import React, { useState, useReducer, useContext, useEffect } from 'react';
import { Space, Button, Popconfirm, Spin } from 'antd';
import StudyPopulationCohortSelect from './SelectStudyPopulation/Utils/StudyPopulationCohortSelect';
import SelectOutcome from "./SelectOutcome/SelectOutcome";
import SelectCovariates from "./SelectCovariates/SelectCovariates";
import CovariatesList from "./Shared/Covariates/CovariatesList";
import ProgressBar from './Shared/ProgressBar/ProgressBar';
// import AttritionTable from './Shared/AttritionTable/AttritionTable';
import { gwasV2Steps, initialWorkflow } from './Shared/constants';
import './GWASV2.css';

const GWASContainer = () => {
  const reducer = (gwas, action) => {
    const { set, update, op = "" } = action;
    switch (typeof set) {
      case "object": {
        const mutation = { ...gwas };
        set.forEach((s) => {
          mutation[s] = update[set.indexOf(s)]
        })
        return mutation
      }
      case "string":
        switch (set) {
          case "covariates":
            const { covariates, covariateSubsets } = gwas;
            const { length } = covariateSubsets;
            // const deleteIdx = op === '-' ? covariateSubsets.find((sub) => sub.find((s) => s.concept_id === update)): 0;
            switch (op) {
              case "+":
                debugger;
                return {
                  ...workflow,
                  [set]: [...covariates, update],
                  "covariateSubsets": length ?
                    [...covariateSubsets, [...covariateSubsets[length - 1], update]]
                    : [[update]]
                }
              case "-":
                console.log('delete update', update) // <-- pass update as an id always so you dont have to check
                debugger;                            // custom dichotomous vs continuous being deleted
                return {
                  ...workflow,          // update should contain what type of cov being deleted to make this reducer fitler cleaner
                  [set]: [...covariates.filter((c) => /* ... */ c)],
                  "covariateSubsets": length === 1 ? [...covariateSubsets.map((sub) => sub.filter((s) => s?.concept_id === update || s?.provided_name === update))] : ''
                }
              // ^ todo:
              // 1) grab idx of first subarray that contains id
              // 2) filter out that covariate from all subarrays in covariateSubsets[idx + 1] - covariateSubsets[length - 1]
              // 3) delete the subarray with idx from 1)
            }

          default:
            return {
              ...gwas,
              [set]: update
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
    covariateSubsets,
    imputationScore,
    mafThreshold,
    selectedHare,
    current
  } = workflow;

  useEffect(() => {
    console.log('covariateSubsets', covariateSubsets)
  }, [covariateSubsets]);

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
            outcome={outcome}
            covariates={covariates}
            handleCovariateSubmit={setWorkflow}
          />
          <CovariatesList
            covariates={covariates}
            setWorkflow={setWorkflow}
           />
        </>;
      case 3:
        return <>
          <ConfigureGWAS
            allCovariates={[...covariates, outcome]}
            imputationScore={imputationScore}
            mafThreshold={mafThreshold}
            selectedHare={selectedHare}
            setGwas={setWorkflow}
            />
            <CovariatesList
            covariates={covariates}
            setWorkflow={setWorkflow}
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
                setWorkflow({ set: "current", update: current - 1 });
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
                  setWorkflow({ set: "current", update: current + 1 });
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
