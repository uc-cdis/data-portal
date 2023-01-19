import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Steps, Button, Space, Popconfirm, Spin, notification,
} from 'antd';
import CheckOutlined from '@ant-design/icons';
import CohortSelect from './shared/CohortSelect';
import CovariateSelect from './shared/CovariateSelect';
import { quantitativeSteps } from './shared/constants';
import { useSourceFetch } from './wizardEndpoints/cohortMiddlewareApi';
import '../GWASUIApp/GWASUIApp.css';
import AddCohortButton from './shared/AddCohortButton';
import OutcomeSelectReview from './OutcomeSelectReview';
import CustomDichotomousSelect from './shared/CustomDichotomousSelect';
import WorkflowParameters from './shared/WorkflowParameters';
import GWASFormSubmit from './shared/GWASFormSubmit';
import TourButton from './shared/TourButton';
import AttritionTable from './shared/AttritionTable';

const { Step } = Steps;

const GWASQuantitative = ({ resetGWASType }) => {
  const [current, setCurrent] = useState(0);
  const [selectedCohort, setSelectedCohort] = useState(undefined);
  const [selectedCovariates, setSelectedCovariates] = useState([]);
  const [outcome, setOutcome] = useState(undefined);
  const [selectedDichotomousCovariates, setSelectedDichotomousCovariates] = useState([]);
  const [selectedHare, setSelectedHare] = useState({ concept_value: '' });
  const [numOfPC, setNumOfPC] = useState(3);
  const [imputationScore, setImputationScore] = useState(0.3);
  const [mafThreshold, setMafThreshold] = useState(0.01);
  const [gwasName, setGwasName] = useState('');

  const { loading, sourceId } = useSourceFetch();

  const handleCohortSelect = (cohort) => {
    setSelectedCohort(cohort);
  };

  const handleCovariateSelect = (cov) => {
    setSelectedCovariates(cov);
  };

  const handleCovariateDelete = (remainingCovariates) => {
    const covariateMapping = remainingCovariates.map((conceptName) => selectedCovariates.find((concept) => concept.concept_name === conceptName));
    setSelectedCovariates(covariateMapping);
  };

  const handleDichotomousCovariateDelete = (remainingDichotomousCovariates) => {
    const covariateMapping = remainingDichotomousCovariates.map((conceptName) => selectedDichotomousCovariates.find((concept) => concept.provided_name === conceptName)); // eslint-disable-line max-len
    setSelectedDichotomousCovariates(covariateMapping);
  };

  const handleOutcomeSelect = (selectedOutcome) => {
    setOutcome(selectedOutcome);
  };

  const openNotification = (dataText, description) => {
    const key = `open${Date.now()}`;
    const btn = (
      <Button type='primary' size='small' onClick={() => notification.close(key)}>
        Confirm
      </Button>
    );
    notification.open({
      message: dataText,
      description,
      icon: (<CheckOutlined />),
      placement: 'top',
      btn,
      key,
    });
  };

  const handleCDAdd = (cd) => {
    const sameCDName = selectedDichotomousCovariates.find((covariate) => covariate.provided_name === cd.provided_name);
    if (sameCDName) {
      openNotification('Custom Dichotomous Covariate names must be unique', '');
      return;
    }

    setSelectedDichotomousCovariates((prevCDArr) => [...prevCDArr, cd]);
  };

  const handleCDRemove = (uuid) => {
    setSelectedDichotomousCovariates((prevCD) => [...prevCD.filter((cd) => cd.uuid !== uuid)]);
  };

  const handleHareChange = (hare) => {
    setSelectedHare(hare);
  };

  const handleGwasNameChange = (e) => {
    setGwasName(e.target.value);
  };

  const handleNumOfPC = (num) => {
    setNumOfPC(num);
  };

  const handleMaf = (maf) => {
    setMafThreshold(maf);
  };

  const handleImputation = (imp) => {
    setImputationScore(imp);
  };

  const resetQuantitative = () => {
    setCurrent(0);
    setSelectedCohort(undefined);
    setSelectedCovariates([]);
    setSelectedDichotomousCovariates([]);
    setSelectedHare({ concept_value: '' });
    setNumOfPC(3);
    setImputationScore(0.3);
    setMafThreshold(0.01);
    setOutcome(undefined);
    setGwasName('');
  };

  const stepInfo = {
    step: current,
    workflowName: 'quantitative',
  };

  const generateStep = () => {
    switch (current) {
    case 0:
      return (!loading && sourceId
        ? (
          <React.Fragment>
            <div data-tour='quant-step-1-new-cohort' className='GWASUI-mt-15'>
              <AddCohortButton />
            </div>
            <React.Fragment>
              <div className='tour-div GWASUI-mt-15'>
                <TourButton stepInfo={stepInfo} />
                <h4>&nbsp;Tutorial</h4>
              </div>
              <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
                <h4 className='GWASUI-selectInstruction' data-tour='quant-step-1-cohort-selection'>In this step, you will determine the study population. To begin, select the cohort that you would like to define your study population with.</h4>
                <div className='GWASUI-mainTable'>
                  <CohortSelect
                    selectedCohort={selectedCohort}
                    handleCohortSelect={handleCohortSelect}
                    sourceId={sourceId}
                    current={current}
                  />
                </div>
              </Space>
            </React.Fragment>
          </React.Fragment>
        ) : <Spin />);
    case 1:
      return (
        <React.Fragment>
          <React.Fragment>
            <div className='tour-div GWASUI-no-padding'>
              <TourButton stepInfo={stepInfo} />
              <h4>&nbsp;Tutorial</h4>
            </div>
            <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
              <h4 className='GWASUI-selectInstruction' data-tour='quant-step-2-choosing-variable'>
                  In this step, you will select the harmonized variables for your study.
                  Please select all variables you wish to use in your model, including both covariates and outcome phenotype.
              </h4>
              <h4 className='GWASUI-selectInstruction'>
                <span className='GWASUI-emphText '>It is mandatory to choose at least one variable to serve as your outcome phenotype.</span>
              </h4>
              <h4 className='GWASUI-selectInstruction'>
                  (Note: population PCs are not included in this step)
              </h4>
              <div className='GWASUI-mainTable'>
                <CovariateSelect
                  selectedCovariates={selectedCovariates}
                  handleCovariateSelect={handleCovariateSelect}
                  sourceId={sourceId}
                  current={current}
                />
              </div>
            </Space>
          </React.Fragment>
        </React.Fragment>
      );
    case 2:
      return (
        <React.Fragment>
          <div className='tour-div GWASUI-no-padding'>
            <TourButton stepInfo={stepInfo} />
            <h4>&nbsp;Tutorial</h4>
          </div>
          <OutcomeSelectReview
            cohortDefinitionId={selectedCohort.cohort_definition_id}
            selectedCovariates={selectedCovariates}
            outcome={outcome}
            handleOutcomeSelect={handleOutcomeSelect}
            sourceId={sourceId}
            current={current}
          />
        </React.Fragment>
      );
    case 3:
      return (
        <React.Fragment>
          <div className='tour-div GWASUI-no-padding'>
            <TourButton stepInfo={stepInfo} />
            <h4>&nbsp;Tutorial</h4>
          </div>
          <CustomDichotomousSelect
            sourceId={sourceId}
            handleCDAdd={handleCDAdd}
            handleCDRemove={handleCDRemove}
            selectedDichotomousCovariates={selectedDichotomousCovariates}
            current={current}
          />
        </React.Fragment>
      );
    case 4:
      return (
        <React.Fragment>
          <div className='tour-div GWASUI-no-padding'>
            <TourButton stepInfo={stepInfo} />
            <h4>&nbsp;Tutorial</h4>
          </div>
          <WorkflowParameters
            quantitativeCohortDefinitionId={selectedCohort.cohort_definition_id}
            selectedCovariates={selectedCovariates}
            selectedDichotomousCovariates={selectedDichotomousCovariates}
            sourceId={sourceId}
            workflowType={'quantitative'}
            numOfPC={numOfPC}
            handleNumOfPC={handleNumOfPC}
            mafThreshold={mafThreshold}
            handleMaf={handleMaf}
            imputationScore={imputationScore}
            handleImputation={handleImputation}
            selectedHare={selectedHare}
            handleHareChange={handleHareChange}
            handleCovariateDelete={handleCovariateDelete}
            handleDichotomousCovariateDelete={handleDichotomousCovariateDelete}
            outcomeId={outcome.concept_id}
          />
        </React.Fragment>
      );
    case 5:
      return (
        <React.Fragment>
          <div className='tour-div GWASUI-no-padding'>
            <TourButton stepInfo={stepInfo} />
            <h4>&nbsp;Tutorial</h4>
          </div>
          <h4 className='GWASUI-selectInstruction'>In this step, you may review the metadata selected for the study, give a name to the study, and submit the GWAS for analysis.</h4>
          <h4 className='GWASUI-selectInstruction'>Upon submission you may review the status of the job in the ‘Submitted Job Status’ in this App above the enumerated steps</h4>
          <div className='GWASUI-mainArea' data-tour='review-metadata'>
            <GWASFormSubmit
              sourceId={sourceId}
              numOfPC={numOfPC}
              mafThreshold={mafThreshold}
              imputationScore={imputationScore}
              selectedHare={selectedHare}
              selectedQuantitativeCohort={selectedCohort}
              workflowType={'quantitative'}
              outcome={outcome}
              selectedCovariates={selectedCovariates}
              selectedDichotomousCovariates={selectedDichotomousCovariates}
              gwasName={gwasName}
              handleGwasNameChange={handleGwasNameChange}
              resetQuantitative={resetQuantitative}
            />
          </div>
        </React.Fragment>
      );
    default:
      return <React.Fragment />;
    }
  };

  let nextButtonEnabled = true;
  if (current === 0 && !selectedCohort) {
    nextButtonEnabled = false;
  } else if (current === 1 && selectedCovariates.length < 1) {
    nextButtonEnabled = false;
  } else if (current === 2) {
    // next button enabled if selected phenotype array length > 0
    nextButtonEnabled = !!outcome;
  } else if (current === 4) {
    nextButtonEnabled = selectedHare?.concept_value !== '' && numOfPC;
  }

  return (
    <React.Fragment>
      {!loading && sourceId && current !== 0 && (
        <AttritionTable
          sourceId={sourceId}
          selectedCohort={selectedCohort || undefined}
          outcome={outcome}
          selectedCovariates={selectedCovariates}
          selectedDichotomousCovariates={selectedDichotomousCovariates}
          tableHeader={'Cohort Attrition Table'}
        />
      )}
      {!loading && sourceId && current === 0 && (
        <div data-tour='attrition-table'>
          <AttritionTable
            sourceId={sourceId}
            selectedCohort={selectedCohort || undefined}
            outcome={outcome}
            selectedCovariates={selectedCovariates}
            selectedDichotomousCovariates={selectedDichotomousCovariates}
            tableHeader={'Cohort Attrition Table'}
          />
        </div>
      )}
      <React.Fragment>
        <Space direction={'vertical'} className='GWASUI-mt-15' style={{ width: '100%' }}>
          <Steps current={current}>
            {quantitativeSteps.map((item) => (
              <Step key={item.title} title={item.title} description={item.description} />
            ))}
          </Steps>
          <div className='steps-content'>
            <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
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
            >
              Previous
            </Button>
            <Popconfirm
              title='Are you sure you want to leave this page?'
              onConfirm={() => resetGWASType()}
              okText='Yes'
              cancelText='No'
            >
              <Button type='link' size='medium' ghost>Select Different GWAS Type</Button>
            </Popconfirm>
            {current < quantitativeSteps.length - 1 && (
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
            {/* added so "select diff gwas" btn retains center position on last page */}
            {current === quantitativeSteps.length - 1 && (<div className='GWASUI-navBtn' />)}
          </div>
        </Space>
      </React.Fragment>
    </React.Fragment>
  );
};

GWASQuantitative.propTypes = {
  resetGWASType: PropTypes.func.isRequired,
};

export default GWASQuantitative;
