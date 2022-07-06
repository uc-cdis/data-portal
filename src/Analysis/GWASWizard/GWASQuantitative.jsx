import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CohortSelect from './shared/CohortSelect';
import { quantitativeSteps } from './shared/constants';
import { useSourceFetch } from "./wizard-endpoints/cohort-middleware-api";
import {
    Steps, Button, Space, Popconfirm
} from 'antd';
import Spinner from '../../components/Spinner';
import '../GWASUIApp/GWASUIApp.css';
import { useQuery, useMutation } from 'react-query';

const { Step } = Steps;

const GWASQuantitative = ({ resetGWASType, refreshWorkflows }) => {
    const [current, setCurrent] = useState(0);
    const [selectedCohort, setSelectedCohort] = useState(undefined);
    const { loading, sourceId } = useSourceFetch();
    // const [selectedCohortId, setSelectedCohortId] = useState(undefined); // not needed if selected cohort is obj that includes id
    const handleCohortSelect = (cohort) => {
        setSelectedCohort(cohort);
    }

    const generateStep = () => {
        switch(current) {
            case 0:
                return (!loading && sourceId ? <CohortSelect selectedCohort={selectedCohort} handleCohortSelect={handleCohortSelect} sourceId={sourceId}></CohortSelect> : <Spinner></Spinner>);
            // case 1:
            //     return ()
        }
    }

    const resetFields = () => {
        // TODO reset to initial state
        refreshWorkflows();
    }

    let nextButtonEnabled = true;
    if (current === 0 && !selectedCohort) {
      nextButtonEnabled = false;
    } else if (current === 1 && selectedConcepts.length < 2) {
      nextButtonEnabled = false;
    } else if (current === 2) {
      // next button enabled if selected phenotype array length > 0
      nextButtonEnabled = !!selectedPhenotype;
    } else if (current === 3) {
      nextButtonEnabled = selectedHare != '' && numOfPC && numOfPC != '';
    }


    return (<>
        <Space direction={'vertical'} style={{ width: '100%' }}>
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
                {current < quantitativeSteps.length - 1 && (
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
                {current === quantitativeSteps.length - 1 && (<div className='GWASUI-navBtn' />)}
            </div>
        </Space>
    </>)
}

GWASQuantitative.propTypes = {
    refreshWorkflows: PropTypes.func.isRequired,
};

export default GWASQuantitative;
