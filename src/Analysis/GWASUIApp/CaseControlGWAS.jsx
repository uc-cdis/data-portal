import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Steps, Button, Space, Table, Input, Form, InputNumber, Select, Switch, Popconfirm
} from 'antd';
import './GWASUIApp.css';
import { useQuery, useMutation } from 'react-query';
import { headers, fetchAndSetCsrfToken } from '../../configs';
import { gwasWorkflowPath, cohortMiddlewarePath, wtsPath } from '../../localconf';
import GWASWorkflowList from './GWASWorkflowList';
import { fetchWithCreds } from '../../actions';
import Spinner from "../../components/Spinner";

const { Step } = Steps;

const steps = [
    {
        title: 'Step 1',
        description: 'Select cohorts for GWAS',
    },
    {
        title: 'Step 2',
        description: 'Select harmonized variables for phenotypes',
    },
    {
        title: 'Step 3',
        description: 'Select harmonized variables for covariates',
    },
    {
        title: 'Step 4',
        description: 'Set workflow parameters and remove unwanted covariates',
    },
    {
        title: 'Step 5',
        description: 'Submit GWAS job',
    },
];

const CaseControlGWAS = (props) => {
    const queryConfig = {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    };
    const [current, setCurrent] = useState(0);

    const generateContentForStep = (stepIndex) => {
        switch (stepIndex) {
            case 0: {
                return (
                    // select case [fetchedCohorts]
                    <span>step 1</span>
                );
            }
            case 1: {
                return (
                    // select control [fetchedCohorts]  (ui validation so control !== case)
                    <span>step 2</span>
                );
            }
            case 2: {
                return (
                    <span>step 3</span>
                );
            }
            case 3: {
                return (
                    <span>step 4</span>
                );
            }
            case 4: {
                return (
                    <span>step 5</span>
                );
            }
        }
    }

    const handleNextStep = () => {
        // based off current, make changes to local state variables
    }

    let nextButtonEnabled = true;

    return (
        <Space direction={'vertical'} style={{ width: '100%' }}>
            {/* <GWASWorkflowList refreshWorkflows={props.refreshWorkflows} /> */}
            <Steps current={current}>
                {steps.map((item) => (
                    <Step key={item.title} title={item.title} description={item.description} />
                ))}
            </Steps>
            <div className='steps-content'>
                <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
                    {generateContentForStep(current)}
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
                    onConfirm={(event) => {
                        props.resetGWASType();
                    }}
                    okText='Yes'
                    cancelText='No'
                >
                    <Button type='link' size='medium' ghost>Select Different GWAS Type</Button>
                </Popconfirm>
                {current < steps.length - 1 && (
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
            </div>
        </Space>
    )
}

CaseControlGWAS.propTypes = {
    // TODO: different workflows refresh?
}

export default CaseControlGWAS;
