import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CohortSelect from './shared/CohortSelect';
import CovariateSelect from './shared/CovariateSelect';
import { caseControlSteps } from './shared/constants';
import { useSourceFetch } from "./wizard-endpoints/cohort-middleware-api";
import {
    Steps, Button, Space, Popconfirm
} from 'antd';
import Spinner from '../../components/Spinner';
import '../GWASUIApp/GWASUIApp.css';
import { useQuery, useMutation } from 'react-query';

const { Step } = Steps;

const GWASCaseControl = ({ resetGWASType, refreshWorkflows }) => {
    const [current, setCurrent] = useState(0);
    const [selectedCaseCohort, setSelectedCaseCohort] = useState(undefined);
    const [selectedControlCohort, setSelectedControlCohort] = useState(undefined);
    const [selectedCovariates, setSelectedCovariates] = useState([]);

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

    const resetFields = () => {
        // TODO reset to initial state
        refreshWorkflows();
    }

    const generateStep = () => {
        switch (current) {
            case 0:
                return (!loading && sourceId ? <CohortSelect selectedCohort={selectedCaseCohort} handleCohortSelect={handleCaseCohortSelect} sourceId={sourceId}></CohortSelect> : <Spinner></Spinner>);
            case 1:
                return (<CohortSelect selectedCohort={selectedControlCohort} handleCohortSelect={handleControlCohortSelect} sourceId={sourceId} caseSelected={selectedCaseCohort ? selectedCaseCohort.cohort_name : ''}></CohortSelect>);
            case 2:
                return (<CovariateSelect selectedCovariates={selectedCovariates} handleCovariateSelect={handleCovariateSelect} sourceId={sourceId}></CovariateSelect>)
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
                            handleNextStep();
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
