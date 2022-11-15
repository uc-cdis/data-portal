import React, { useState } from 'react';
import { Space, Button, Popconfirm } from 'antd';
import SelectStudyPopulation from './SelectStudyPopulation/SelectStudyPopulation';
import ProgressBar from './Shared/ProgressBar/ProgressBar';
import AttritionTableWrapper from './Shared/AttritionTableWrapper/AttritionTableWrapper';
import { useSourceFetch } from './Shared/wizardEndpoints/cohortMiddlewareApi';
import { gwasV2Steps } from './Shared/constants';
import './GWASV2.css';

const GWASContainer = () => {
  const { loading, sourceId } = useSourceFetch();
  const [current, setCurrent] = useState(0);
  const [
    selectedStudyPopulationCohort,
    setSelectedStudyPopulationCohort,
  ] = useState({});
  const [selectedControlCohort] = useState(undefined);
  const [newCovariateSubset] = useState([]);
  const [outcome] = useState({});

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
