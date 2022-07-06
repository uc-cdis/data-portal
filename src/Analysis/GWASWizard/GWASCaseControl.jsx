import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CohortSelect from './shared/CohortSelect';
import CovariateSelect from './shared/CovariateSelect';
import CustomDichotomousSelect from "./shared/CustomDichotomousSelect";
import { caseControlSteps } from './shared/constants';
import { useSourceFetch } from "./wizard-endpoints/cohort-middleware-api";
import {
    Steps, Button, Space, Popconfirm
} from 'antd';
import Spinner from '../../components/Spinner';
import '../GWASUIApp/GWASUIApp.css';
import { useQuery, useMutation } from 'react-query';
import AddCohortButton from './shared/AddCohortButton';

const { Step } = Steps;

const GWASCaseControl = ({ resetGWASType, refreshWorkflows }) => {
    const [current, setCurrent] = useState(0);
    const [selectedCaseCohort, setSelectedCaseCohort] = useState(undefined);
    const [selectedControlCohort, setSelectedControlCohort] = useState(undefined);
    const [selectedCovariates, setSelectedCovariates] = useState([]);
    const [customDichotomous, setCustomDichotomous] = useState([]);

    const { loading, sourceId } = useSourceFetch();

    const handleCaseCohortSelect = (cohort) => {
        setSelectedCaseCohort(cohort);
    }
    const handleControlCohortSelect = (cohort) => {
        setSelectedControlCohort(cohort);
    }

    const handleCovariateSelect = (cov) => {
        setSelectedCovariates(cov);
    }

    const handleCDSelect = (cd) => {
        // setCustomDichotomous((prevCd) => {
        //     return [...prevCd, cd]
        // });

        // or

        // setCustomDichotomous(cd);
    }

    const resetFields = () => {
        // TODO reset to initial state
        refreshWorkflows();
    }

    const generateStep = () => {
        switch (current) {
            case 0:
                // TODO: move this CD Select Component to new step (4) after completed
                // return (<CustomDichotomousSelect handleCDSelect={handleCDSelect}></CustomDichotomousSelect>)
                return (!loading && sourceId ? (<>
                    <AddCohortButton></AddCohortButton>
                    <React.Fragment>
                        <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
                            <h4 className='GWASUI-selectInstruction'>In this step, you will determine the study population. To begin, select the cohort that you would like to define your study population with.</h4>
                            <div className='GWASUI-mainTable'>
                                <CohortSelect selectedCohort={selectedCaseCohort} handleCohortSelect={handleCaseCohortSelect} sourceId={sourceId}></CohortSelect>
                            </div>
                        </Space>
                        <CustomDichotomousSelect handleCDSelect={handleCDSelect} customDichotomous={customDichotomous}></CustomDichotomousSelect>
                    </React.Fragment>
                </>) : <Spinner></Spinner>);
            case 1:
                return (<>
                    <AddCohortButton></AddCohortButton>
                    <React.Fragment>
                        <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
                            <h4 className='GWASUI-selectInstruction'>In this step, you will continue to define the study population. Please select the cohort that you would like to define as your study “control” population.</h4>
                            <div className='GWASUI-mainTable'>
                                <CohortSelect selectedCohort={selectedControlCohort} handleCohortSelect={handleControlCohortSelect} sourceId={sourceId} otherCohortSelected={selectedCaseCohort ? selectedCaseCohort.cohort_name : ''}></CohortSelect>
                            </div>
                        </Space>
                    </React.Fragment>
                </>);
            case 2:
                return (<CovariateSelect selectedCovariates={selectedCovariates} handleCovariateSelect={handleCovariateSelect} sourceId={sourceId}></CovariateSelect>);
            case 3:
                return (<CustomDichotomousSelect sourceId={sourceId} handleCDSelect={handleCDSelect}></CustomDichotomousSelect>)
        }
    }

    let nextButtonEnabled = true;
    if ((current === 0 && !selectedCaseCohort) || (current === 1 && !selectedControlCohort)) {
        // Cohort selection
        nextButtonEnabled = false;
    } else if (current === 2 && selectedCovariates.length < 1) {
        // covariate selection
        nextButtonEnabled = false;
    } else if (current === 4) {
        nextButtonEnabled = selectedHare != '' && numOfPC && numOfPC != '';
    }

    return (<>
        <Space direction={'vertical'} style={{ width: '100%' }}>
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
    </>)
}

GWASCaseControl.propTypes = {
    refreshWorkflows: PropTypes.func.isRequired,
};

export default GWASCaseControl;
