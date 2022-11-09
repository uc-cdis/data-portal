import React, { useState } from 'react';
import { Space, Button, Popconfirm } from 'antd';
import SelectStudyPopulation from './SelectStudyPopulation/SelectStudyPopulation';
import ProgressBar from './Shared/ProgressBar/ProgressBar';
import { useSourceFetch } from './Shared/wizardEndpoints/cohortMiddlewareApi';
import { gwasV2Steps } from './Shared/constants';
import './GWASV2.css';
import AttritionTableWrapper from './Shared/AttritionTable/AttritionTableWrapper';

const GWASContainer = () => {
  const { loading, sourceId } = useSourceFetch();
  const [current, setCurrent] = useState(0);
  const [
    selectedStudyPopulationCohort,
    setSelectedStudyPopulationCohort,
  ] = useState({});
  const [selectedControlCohort] = useState(undefined);
  const [selectedCaseCohort] = useState(undefined);
  const [selectedCovariates] = useState([]);
  const [newCovariateSubset] = useState([
    {
      variable_type: 'custom_dichotomous',
      provided_name: 'providednamebyuser',
      cohort_ids: [12, 32],
    },
    {
      variable_type: 'concept',
      concept_id: 'id',
      concept_name: 'concept name',
    },
  ]);
  const [selectedDichotomousCovariates] = useState([]);

  // THIS IS THE STRUCTURE FOR QUANTITIVE; when quantitive it will be variable_type:concept
  // WHEN IT IS case control: it will be variable_type: 'custom_dichotomous'
  const [outcome, setOutcome] = useState({
    variable_type: 'concept',
    concept_id: 'id',
    concept_name: 'concept name',
  });

  const generateStep = () => {
    // steps 2 & 3 very similar
    switch (current) {
      case 0:
        // select study population
        return (
          <SelectStudyPopulation
            selectedStudyPopulationCohort={selectedStudyPopulationCohort}
            setSelectedStudyPopulationCohort={setSelectedStudyPopulationCohort}
            current={current}
          />
        );
      case 1:
        // outcome (customdichotomous or not)
        return <React.Fragment>step 2</React.Fragment>;
      case 2:
        // covariates (customdichtomous or not)
        return <React.Fragment>step 3</React.Fragment>;
      case 3:
        // all other input (mafs, imputation, etc), review, and submit
        return <React.Fragment>step 4</React.Fragment>;
      default:
        // required for eslint
        return null;
    }
  };

  let nextButtonEnabled = true;
  if (
    current === 0 &&
    Object.keys(selectedStudyPopulationCohort).length === 0
  ) {
    nextButtonEnabled = false;
  }

  return (
    <React.Fragment>
      <ProgressBar current={current} />
      {!loading && sourceId && (
        <React.Fragment>
          <AttritionTableWrapper
            sourceId={sourceId}
            newCovariateSubset={newCovariateSubset}
            selectedCohort={selectedStudyPopulationCohort}
            otherSelectedCohort={selectedControlCohort}
            outcome={outcome}
            selectedCovariates={selectedCovariates}
            selectedDichotomousCovariates={selectedDichotomousCovariates}
          />
        </React.Fragment>
      )}
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
