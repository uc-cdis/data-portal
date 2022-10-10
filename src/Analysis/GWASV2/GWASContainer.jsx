import React, { useState, useEffect } from "react";
import { PropTypes } from "prop-types";
import { Space, Button, Steps, Step, Popconfirm } from "antd";
import SelectStudyPopulation from "./SelectStudyPopulation/SelectStudyPopulation";

const GWASContainer = () => {
    const [current, setCurrent] = useState(0);
    const gwasSteps = [
        {
            title: 'Step 1',
            description: 'Select Study Population',
        },
        {
            title: 'Step 2',
            description: 'Select Outcome Phenotypes',
        },
        {
            title: 'Step 3',
            description: 'Select Covariate Phenotype',
        },
        {
            title: 'Step 4',
            description: 'Configure GWAS',
        }
    ]

    const generateStep = () => {
        // steps 2 & 3 very similar
        switch (current) {
            case 0:
                // select study population
                return <>step 1 <SelectStudyPopulation /></>
            case 1:
                // outcome (customdichotomous or not)
                return <>step 2</>
            case 2:
                // covariates (customdichtomous or not)
                return <>step 3</>
            case 3:
                // all other input (mafs, imputation, etc), review, and submit
                return <>step 4</>
        }
    }
    return (
        <React.Fragment>
            <React.Fragment>
                <Space direction={'vertical'} style={{ width: '100%' }}>
                    <Steps current={current}>
                        {gwasSteps.map((item, idx) => {
                            <Step key={idx} title={item.title} description={item.description} />
                        })}
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
                            //   onConfirm={() => resetGWASType()}
                            okText='Yes'
                            cancelText='No'
                        >
                            <Button type='link' size='medium' ghost>Select Different GWAS Type</Button>
                        </Popconfirm>
                        {current < gwasSteps.length - 1 && (
                            <Button
                                data-tour='next-button'
                                className='GWASUI-navBtn GWASUI-navBtn__next'
                                type='primary'
                                onClick={() => {
                                    setCurrent(current + 1);
                                }}
                            // disabled={!nextButtonEnabled}
                            >
                                Next
                            </Button>
                        )}
                        {current === gwasSteps.length - 1 && (<div className='GWASUI-navBtn' />)}
                    </div>
                </Space>
            </React.Fragment>
        </React.Fragment>
    )
}

GWASContainer.propTypes = {
    refreshWorkflows: PropTypes.func.isRequired
}

export default GWASContainer;
