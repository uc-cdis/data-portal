import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Steps, Button, Space, Popconfirm, Spin, notification, Table,
} from 'antd';
import CheckOutlined from '@ant-design/icons';
import CohortSelect from './shared/CohortSelect';
import CovariateSelect from './shared/CovariateSelect';
import CustomDichotomousSelect from './shared/CustomDichotomousSelect';
import { caseControlSteps } from './shared/constants';
import { useSourceFetch, getAllHareItems } from './wizardEndpoints/cohortMiddlewareApi';
import '../GWASUIApp/GWASUIApp.css';
import AddCohortButton from './shared/AddCohortButton';
import CovariateReview from './CovariateReview';
import WorkflowParameters from './shared/WorkflowParameters';
import GWASFormSubmit from './shared/GWASFormSubmit';
import TourButton from './shared/TourButton';
import AttritionTable from './shared/AttritionTable';

const { Step } = Steps;

const GWASCaseControl = ({ resetGWASType }) => {
  const [current, setCurrent] = useState(0);
  const [selectedCaseCohort, setSelectedCaseCohort] = useState(undefined);
  const [selectedControlCohort, setSelectedControlCohort] = useState(undefined);
  const [selectedCovariates, setSelectedCovariates] = useState([]);
  const [selectedDichotomousCovariates, setSelectedDichotomousCovariates] = useState([]);
  const [selectedHare, setSelectedHare] = useState({ concept_value: '' });
  const [numOfPC, setNumOfPC] = useState(3);
  const [imputationScore, setImputationScore] = useState(0.3);
  const [mafThreshold, setMafThreshold] = useState(0.01);
  const [gwasName, setGwasName] = useState('');
  const [cohortSizes, setCohortSizes] = useState([]);

  const { loading, sourceId } = useSourceFetch();

  const handleCaseCohortSelect = (cohort) => {
    setSelectedCaseCohort(cohort);
  };
  const handleControlCohortSelect = (cohort) => {
    setSelectedControlCohort(cohort);
  };

  const handleCovariateSelect = (cov) => {
    setSelectedCovariates(cov);
  };

  const handleDichotomousCovariateDelete = (remainingDichotomousCovariates) => {
    const covariateMapping = remainingDichotomousCovariates.map((conceptName) => selectedDichotomousCovariates.find((concept) => concept.provided_name === conceptName)); // eslint-disable-line max-len
    setSelectedDichotomousCovariates(covariateMapping);
  };

  const handleCovariateDelete = (remainingCovariates) => {
    const covariateMapping = remainingCovariates.map((conceptName) => selectedCovariates.find((concept) => concept.concept_name === conceptName));
    setSelectedCovariates(covariateMapping);
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

    setSelectedDichotomousCovariates((prevCD) => [...prevCD, cd]);
  };

  const handleCDRemove = (uuid) => {
    setSelectedDichotomousCovariates((prevCD) => [...prevCD.filter((cd) => cd.uuid !== uuid)]);
  };

  const handleHareChange = (hare, allCaseHares, allControlHares) => {
    if (hare.concept_value.length > 0) {
      const hareBreakdown = getAllHareItems(hare.concept_value,
        allCaseHares, allControlHares);
      const { caseSize, controlSize } = {
        caseSize: hareBreakdown[0].persons_in_cohort_with_value,
        controlSize: hareBreakdown[1].persons_in_cohort_with_value,
      };
      setCohortSizes([caseSize, controlSize]);
    }
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

  const resetCaseControl = () => {
    setCurrent(0);
    setSelectedCaseCohort(undefined);
    setSelectedControlCohort(undefined);
    setSelectedCovariates([]);
    setSelectedDichotomousCovariates([]);
    setSelectedHare({ concept_value: '' });
    setNumOfPC(3);
    setImputationScore(0.3);
    setMafThreshold(0.01);
    setGwasName('');
  };

  const generateStep = () => {
    const stepInfo = {
      step: current,
      workflowName: 'case control',
    };
    switch (current) {
    case 0:
      return (!loading && sourceId ? (
        <React.Fragment>
          <div data-tour='step-1-new-cohort' className='GWASUI-mt-15'>
            <AddCohortButton />
          </div>
          <React.Fragment>
            <div className='tour-div GWASUI-mt-15'>
              <TourButton stepInfo={stepInfo} />
              <h4>&nbsp;Tutorial</h4>
            </div>
            <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
              <h4 className='GWASUI-selectInstruction' data-tour='step-1-cohort-selection'>
                  In this step, you will begin to determine your study populations.
                  To begin, select the cohort that you would like to define as your study <span className='GWASUI-emphText'>case</span> population.
              </h4>
              <div className='GWASUI-mainTable'>
                <CohortSelect
                  selectedCohort={selectedCaseCohort}
                  handleCohortSelect={handleCaseCohortSelect}
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
          <div className='GWASUI-mt-15'>
            <AddCohortButton />
          </div>
          <React.Fragment>
            <div className='tour-div GWASUI-mt-15'>
              <TourButton stepInfo={stepInfo} />
              <h4>&nbsp;Tutorial</h4>
            </div>
            <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
              <h4 className='GWASUI-selectInstruction' data-tour='step-2-cohort-selection'>
                  In this step, you will continue to define your study populations.
                  Please select the cohort that you would like to define as your study
                <span className='GWASUI-emphText'>control</span> population.
              </h4>
              <div className='GWASUI-mainTable'>
                <CohortSelect
                  selectedCohort={selectedControlCohort}
                  handleCohortSelect={handleControlCohortSelect}
                  sourceId={sourceId}
                  otherCohortSelected={selectedCaseCohort ? selectedCaseCohort.cohort_name : ''}
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
          <React.Fragment>
            <div className='tour-div GWASUI-no-padding'>
              <TourButton stepInfo={stepInfo} />
              <h4>&nbsp;Tutorial</h4>
            </div>
            <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
              <h4 className='GWASUI-selectInstruction' data-tour='step-3-choosing-variable'>In this step, you will select the harmonized continuous covariates for your study. Please select all variables you wish to use in your model. (Note: population PCs are not included in this step)</h4>
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
    case 3:
      return (
        <React.Fragment>
          {selectedCovariates.length > 0
              && (
                <div className='tour-div'>
                  <TourButton stepInfo={stepInfo} className='GWASUI-no-padding' />
                  <h4>&nbsp;Tutorial</h4>
                </div>
              )}
          <React.Fragment>
            {selectedCovariates.length === 0
                && (
                  <React.Fragment>
                    <div className='GWASUI-mainTable GWASUI-spinnerContainer'>
                      <Table
                        dataSource={[{ placeholder: 'No covariates to review' }]}
                        columns={[
                          {
                            title: '',
                            dataIndex: 'placeholder',
                            key: 'placeholder',
                          },
                        ]}
                        pagination={false}
                      />
                    </div>
                  </React.Fragment>
                )}
          </React.Fragment>
          {selectedCovariates.length > 0
              && (
                <CovariateReview
                  caseCohortDefinitionId={selectedCaseCohort.cohort_definition_id}
                  controlCohortDefinitionId={selectedControlCohort.cohort_definition_id}
                  selectedCovariates={selectedCovariates}
                  sourceId={sourceId}
                />
              )}
        </React.Fragment>
      );
    case 4:
      return (
        <React.Fragment>
          <div className='tour-div'>
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
    case 5:
      return (
        <React.Fragment>
          <div className='tour-div'>
            <TourButton stepInfo={stepInfo} />
            <h4>&nbsp;Tutorial</h4>
          </div>
          <WorkflowParameters
            caseCohortDefinitionId={selectedCaseCohort.cohort_definition_id}
            controlCohortDefinitionId={selectedControlCohort.cohort_definition_id}
            selectedCovariates={selectedCovariates}
            selectedDichotomousCovariates={selectedDichotomousCovariates}
            sourceId={sourceId}
            workflowType={'caseControl'}
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
          />
        </React.Fragment>
      );
    case 6:
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
              selectedCaseCohort={selectedCaseCohort}
              selectedControlCohort={selectedControlCohort}
              cohortSizes={cohortSizes}
              workflowType={'caseControl'}
              selectedCovariates={selectedCovariates}
              selectedDichotomousCovariates={selectedDichotomousCovariates}
              gwasName={gwasName}
              handleGwasNameChange={handleGwasNameChange}
              resetCaseControl={resetCaseControl}
            />
          </div>
        </React.Fragment>
      );
    default:
      return <React.Fragment />;
    }
  };

  let nextButtonEnabled = true;
  if ((current === 0 && !selectedCaseCohort) || (current === 1 && !selectedControlCohort)) {
    // Cohort selection
    nextButtonEnabled = false;
  } else if (current === 5) {
    nextButtonEnabled = selectedHare?.concept_value !== '' && numOfPC;
  }

  return (
    <React.Fragment>
      {!loading && sourceId && current !== 0 && (
        <React.Fragment>
          <AttritionTable
            sourceId={sourceId}
            selectedCohort={selectedCaseCohort}
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
      )}
      {!loading && sourceId && current === 0 && (
        <React.Fragment>
          <div data-tour='attrition-table'>
            <AttritionTable
              sourceId={sourceId}
              selectedCohort={selectedCaseCohort}
              otherSelectedCohort={selectedControlCohort}
              // outcome={outcome}
              selectedCovariates={selectedCovariates}
              selectedDichotomousCovariates={selectedDichotomousCovariates}
              tableHeader={'Case Cohort Attrition Table'}
            />
          </div>
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
      )}
      <Space direction={'vertical'} className='GWASUI-mt-15' style={{ width: '100%' }}>
        <Steps current={current}>
          {caseControlSteps.map((item) => (
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
            className='GWASUI-navBtn GWASUI-navBtn__prev'
            disabled={current === 0}
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
          {current < caseControlSteps.length - 1 && (
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
          {current === caseControlSteps.length - 1 && (<div className='GWASUI-navBtn' />)}
        </div>
      </Space>
    </React.Fragment>
  );
};

GWASCaseControl.propTypes = {
  resetGWASType: PropTypes.func.isRequired,
};

export default GWASCaseControl;
