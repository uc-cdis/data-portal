import React, { useState, useReducer } from 'react';
import { Space, Button, Popconfirm, Spin } from 'antd';
import SelectStudyPopulation from './SelectStudyPopulation/SelectStudyPopulation';
import ProgressBar from './Shared/ProgressBar/ProgressBar';
// import AttritionTable from './Shared/AttritionTable/AttritionTable';
import { useSourceFetch } from './Shared/wizardEndpoints/cohortMiddlewareApi';
import { gwasV2Steps } from './Shared/constants';
import './GWASV2.css';

const GWASContainer = () => {
  const initialState = {
    outcome: {},
    selectedStudyPopulationCohort: {},
    allCovariates: [],
    imputationScore: 0.3,
    mafThreshold: 0.01,
    numOfPC: 3,
    gwasName: '',
    selectedHare: { concept_value: '' }
  }
  const reducer = (gwas, action) => {
    const { type, update } = action;
    switch (type) {
      default:
        return {
          ...gwas,
          [type]: update
        }
    }
  }

  const [gwas, setGwas] = useReducer(reducer, initialState);
  const [current, setCurrent] = useState(0);
  const { loading, sourceId } = useSourceFetch();
  // const [selectedControlCohort] = useState(undefined);
  // const [selectedCaseCohort] = useState(undefined);
  // const [selectedCovariates] = useState([]);
  // const [selectedDichotomousCovariates] = useState([]);

  const generateStep = () => {
    // steps 2 & 3 very similar
    switch (current) {
      case 0:
        // select study population
        return (
          <SelectStudyPopulation
            selectedStudyPopulationCohort={gwas.selectedStudyPopulationCohort}
            setSelectedStudyPopulationCohort={setGwas}
            current={current}
            sourceId={sourceId}
          />
        );
      case 1:
        // outcome (customdichotomous or not)
        return <>
          <SelectOutcome
            outcome={gwas.outcome}
            allCovariates={gwas.allCovariates}
            handleOutcome={setGwas}
            sourceId={sourceId}
            current={current}
          />
        </>
      case 2:
        // covariates (customdichtomous or not)
        return <>
          <SelectCovariates
            allCovariates={gwas.allCovariates}
            setGwas={setGwas}
          />
        </>;
      case 3:
        // all other input (mafs, imputation, etc), review, and submit
        return <>
          <ConfigureGWAS
            allCovariates={gwas.allCovariates}
            imputationScore={gwas.imputationScore}
            mafThreshold={gwas.mafThreshold}
            selectedHare={gwas.selectedHare}
            setGwas={setGwas}
          /></>;
      default:
        // required for eslint
        return null;
    }
  };

  let nextButtonEnabled = true;
  if (
    current === 0
    && Object.keys(gwas.selectedStudyPopulationCohort).length === 0
  ) {
    nextButtonEnabled = false;
  }

  return (
    <React.Fragment>
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
              {!loading && sourceId ? generateStep(current) : (
                <Spin />
              )}
            </Space>
          </div>
          <div className='steps-action'>
            <Button
              className='GWASUI-navBtn GWASUI-navBtn__next'
              type='primary'
              onClick={() => {
                setCurrent(current - 1);
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
                  setCurrent(current + 1);
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
