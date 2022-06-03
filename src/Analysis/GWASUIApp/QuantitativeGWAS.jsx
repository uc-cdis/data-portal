import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Steps, Button, Space, Table, Input, Form, InputNumber, Select, Switch, Popconfirm, notification, Popover
} from 'antd';
import './GWASUIApp.css';
import { useQuery, useMutation } from 'react-query';
import { headers } from '../../configs';
import { gwasWorkflowPath, cohortMiddlewarePath, wtsPath } from '../../localconf';
import GWASWorkflowList from './GWASWorkflowList';
import { fetchWithCreds } from '../../actions';
import Spinner from "../../components/Spinner";
import Dropdown from '@gen3/ui-component/dist/components/Dropdown';
import { CheckOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Step } = Steps;

const steps = [
    {
        title: 'Step 1',
        description: 'Select a cohort for GWAS',
    },
    {
        title: 'Step 2',
        description: 'Select harmonized variables for phenotypes and covariates',
    },
    {
        title: 'Step 3',
        description: 'Select which variable is your phenotype',
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

const QuantitativeGWAS = (props) => {
    const queryConfig = {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    };
    const [current, setCurrent] = useState(0);
    const [sourceId, setSourceId] = useState(undefined);
    const [cohortDefinitionId, setCohortDefinitionId] = useState(undefined);
    const [conceptVars] = useState({
        ConceptIds: [2000006886, 2000000280, 2000000895, 2000000914, 2000000900, 2000000846, 2000000872, 2000000873, 2000000874, 2000006885, 2000000708],
    });
    const hareConceptId = 2090006880;
    const [selectedConceptVars, setSelectedConceptVars] = useState([]);

    const [form] = Form.useForm();

    const [selectedCohort, setSelectedCohort] = useState(undefined);
    const [selectedConcepts, setSelectedConcepts] = useState([]);
    const [covariates, setCovariates] = useState([]);
    const [selectedOutcome, setSelectedOutcome] = useState([]);
    const [imputationScore, setImputationScore] = useState(0.3);
    const [mafThreshold, setMafThreshold] = useState(0.01);

    const [numOfPC, setNumOfPC] = useState(3);
    const [selectedPhenotype, setSelectedPhenotype] = useState(undefined);
    const [selectedCovariates, setSelectedCovariates] = useState([]);
    const [selectedHare, setSelectedHare] = useState("-select one-");
    const [gwasJobName, setGwasJobName] = useState("");

    const onStep5FormSubmit = (values) => {
        setImputationScore(values.imputationCutoff);
        setMafThreshold(values.mafCutoff);
        setNumOfPC(values.numOfPC);
    };

    const handleNextStep = () => {
        if (current === 1) {
            setSelectedPhenotype(selectedConcepts[0]);
            setSelectedCovariates([...selectedConcepts].slice(1));
            setCovariates([...selectedConcepts].slice(1).map((val) => val.prefixed_concept_id));
            setSelectedOutcome(selectedConcepts[0].prefixed_concept_id);

            form.setFieldsValue({
                covariates: [...selectedConcepts].slice(1).map((val) => val.concept_name),
                outcome: selectedConcepts[0].concept_name,
            });
        }
        if (current === 3) {
            form.submit();
        }
    };

    async function fetchSources() {
        const sourcesEndpoint = `${cohortMiddlewarePath}sources`;
        const getSources = await fetch(sourcesEndpoint);
        return getSources.json();
    }

    async function fetchCohortDefinitions() {
        const cohortEndPoint = `${cohortMiddlewarePath}cohortdefinition-stats/by-source-id/${sourceId}`;
        const getCohortDefinitions = await fetch(cohortEndPoint);
        return getCohortDefinitions.json();
    }

    async function fetchConceptStatsByHare() {
        var conceptIds = [...selectedConcepts].map((val) => val.concept_id);
        const conceptIdsPayload = { ConceptIds: conceptIds };
        const conceptStatsEndPoint = `${cohortMiddlewarePath}concept-stats/by-source-id/${sourceId}/by-cohort-definition-id/${cohortDefinitionId}/breakdown-by-concept-id/${hareConceptId}`;
        const reqBody = {
            method: 'POST',
            credentials: 'include',
            headers,
            body: JSON.stringify(conceptIdsPayload),
        };
        const getConceptStats = await fetch(conceptStatsEndPoint, reqBody);
        return getConceptStats.json();
    }

    async function fetchConcepts() {
        const conceptEndpoint = `${cohortMiddlewarePath}concept/by-source-id/${sourceId}`;
        const reqBody = {
            method: 'POST',
            credentials: 'include',
            headers,
            body: JSON.stringify(conceptVars),
        };
        const getConcepts = await fetch(conceptEndpoint, reqBody);
        return getConcepts.json();
    }

    async function fetchConceptStats() {
        const conceptStatsVars = { ConceptIds: selectedConceptVars };
        const conceptStatsEndpoint = `${cohortMiddlewarePath}concept-stats/by-source-id/${sourceId}/by-cohort-definition-id/${cohortDefinitionId}`;
        const reqBody = {
            method: 'POST',
            credentials: 'include',
            headers,
            body: JSON.stringify(conceptStatsVars),
        };
        const getConceptStats = await fetch(conceptStatsEndpoint, reqBody);
        return getConceptStats.json();
    }

    const step1TableRowSelection = {
        type: 'radio',
        columnTitle: 'Select',
        selectedRowKeys: (selectedCohort) ? [selectedCohort.cohort_definition_id] : [],
        onChange: (_, selectedRows) => {
            setSelectedCohort(selectedRows[0]);
            setCohortDefinitionId(selectedRows[0].cohort_definition_id);
        },
        getCheckboxProps: (record) => ({
            disabled: record.size === 0,
        }),
    };

    const step1TableConfig = [
        {
            title: 'Cohort Name',
            dataIndex: 'cohort_name',
            key: 'cohort_name',
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
        },
    ];

    const step2TableRowSelection = {
        type: 'checkbox',
        columnTitle: 'Select',
        selectedRowKeys: selectedConcepts.map((val) => val.concept_id),
        onChange: (_, selectedRows) => {
            setSelectedConceptVars(selectedRows.map((item) => item.concept_id));
            setSelectedConcepts(selectedRows);
        },
    };

    const step2TableConfig = [
        {
            title: 'Concept ID',
            dataIndex: 'concept_id',
            key: 'concept_name',
        },
        {
            title: 'Concept Name',
            dataIndex: 'concept_name',
            key: 'concept_name',
            filterSearch: true,
        },
    ];

    const step3TableRowSelection = {
        type: 'radio',
        columnTitle: 'Phenotype',
        selectedRowKeys: (selectedPhenotype) ? [selectedPhenotype.concept_id] : [],
        onChange: (_, selectedRows) => {
            const newlySelectedCovariates = selectedConcepts.filter((data) => data.concept_id !== selectedRows[0].concept_id);
            setSelectedPhenotype(selectedRows[0]);
            setSelectedOutcome(selectedRows[0].prefixed_concept_id);
            setSelectedCovariates(newlySelectedCovariates);
            form.setFieldsValue({
                covariates: newlySelectedCovariates.map((val) => val.concept_name),
                outcome: selectedRows[0].concept_name,
            });
        },
    };

    const step3TableConfig = [
        {
            title: 'Concept ID',
            dataIndex: 'concept_id',
            key: 'concept_id',
        },
        {
            title: 'Concept Name',
            dataIndex: 'concept_name',
            key: 'concept_name',
        },
        {
            title: 'Missing',
            dataIndex: 'n_missing_ratio',
            key: 'n_missing_ratio',
            render: (_, record) => (
                <span>{`${(record.n_missing_ratio * 100).toFixed(0)}%`}</span>
            ),
        },
    ];

    const handleCovariateDelete = (remainingCovariates) => {
        const remainingCovArr = [];
        remainingCovariates.forEach((name) => {
            selectedCovariates.forEach((covObj) => {
                if (covObj.concept_name === name) {
                    remainingCovArr.push(covObj);
                }
            });
        });
        setCovariates(remainingCovArr.map((c) => c.prefixed_concept_id));
        setSelectedCovariates(remainingCovArr);
        setSelectedConcepts([...remainingCovArr, selectedPhenotype]);
        setSelectedConceptVars([...remainingCovArr, selectedPhenotype].map((r) => r.concept_id));

        form.setFieldsValue({
            covariates: remainingCovariates,
        });
    };

    useEffect(() => {
        // do wts login and fetch sources on initialization
        fetchWithCreds({
            path: `${wtsPath}connected`,
            method: 'GET',
        })
            .then(
                (res) => {
                    if (res.status !== 200) {
                        window.location.href = `${wtsPath}authorization_url?redirect=${window.location.pathname}`;
                    } else {
                        fetchSources().then((data) => setSourceId(data.sources[0].source_id));
                    }
                },
            );
    }, []);

    const CohortDefinitions = () => {
        const { data, status } = useQuery(['cohortdefinitions', sourceId], fetchCohortDefinitions, queryConfig);

        if (status === 'loading') {
            return <Spinner />;
        }
        if (status === 'error') {
            return <React.Fragment>Error</React.Fragment>;
        }
        const content = (
            <div>
                <p>example content</p>
            </div>
        );
        return (
            <React.Fragment>
                <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
                    <Popover content={content} title="example title">
                        <InfoCircleOutlined />
                    </Popover>
                    <h4 className='GWASUI-selectInstruction'>In this step, you will determine the study population. To begin, select the cohort that you would like to define your study population with.</h4>
                    <button onClick={() => window.open(cohortMiddlewarePath.replace('cohort-middleware', 'analysis/OHDSI%20Atlas'), '_blank')}>+ Add a new cohort</button>
                    <div className='GWASUI-mainTable'>
                        <Table
                            className='GWASUI-table1'
                            rowKey='cohort_definition_id'
                            size='middle'
                            pagination={{ pageSize: 10 }}
                            rowSelection={step1TableRowSelection}
                            columns={step1TableConfig}
                            dataSource={data.cohort_definitions_and_stats.filter((x) => x.size > 0)} // many entries w/ size 0 in prod
                        />
                    </div>
                </Space>
            </React.Fragment>
        );
    };

    // allow only continuous concepts for now:
    const allowedConceptTypes = ["contin"];

    function filterConcepts(concepts) {
        const filteredConcepts = [];
        for (const concept_idx in concepts) {
            const concept = concepts[concept_idx];
            if (allowedConceptTypes.indexOf(concept.concept_type) != -1) {
                filteredConcepts.push(concept);
            }
        }
        return filteredConcepts;
    }

    const CohortConcepts = () => {
        const { data, status } = useQuery(['cohortconcepts', sourceId], fetchConcepts, queryConfig);

        if (status === 'loading') {
            return <Spinner />;
        }
        if (status === 'error') {
            return <React.Fragment>Error</React.Fragment>;
        }

        const content = (
            <div>
                <p>example content</p>
            </div>
        );

        // filter concepts to only allow for certain concept types:
        const filteredConcepts = filterConcepts(data.concepts);
        if (filteredConcepts.length === 0) {
            return <React.Fragment>Unexpected error: no continuous concepts found!</React.Fragment>;
        }
        return (
            <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
                <Popover content={content} title="example title">
                    <InfoCircleOutlined />
                </Popover>
                <h4 className='GWASUI-selectInstruction'>In this step, you will select the harmonized variables for your study. Please select all variables you wish to use in your model, including both covariates and phenotype. (Note: population PCs are not included in this step)</h4>
                <div className='GWASUI-mainTable'>
                    <Table
                        className='GWASUI-table2'
                        rowKey='concept_id'
                        pagination={{ pageSize: 10 }}
                        rowSelection={step2TableRowSelection}
                        columns={step2TableConfig}
                        dataSource={filteredConcepts}
                    />
                </div>
            </Space>
        );
    };

    const CohortConceptStats = () => {
        const { data, status } = useQuery(['cohortstats', selectedConcepts], fetchConceptStats, queryConfig);

        if (status === 'loading') {
            return <Spinner />;
        }
        if (status === 'error') {
            return <React.Fragment>Error</React.Fragment>;
        }
        return (
            <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
                <hr />
                <h4 className='GWASUI-selectInstruction'>In this Step, you will determine your phenotype, using the selected variables from Step 2. Please choose one of the selected variables to be the study’s phenotype.</h4>
                <div className='GWASUI-mainTable'>
                    <Table
                        className='GWASUI-table3'
                        rowKey='concept_id'
                        pagination={{ pageSize: 10 }}
                        rowSelection={step3TableRowSelection}
                        columns={step3TableConfig}
                        dataSource={data.concepts}
                    />
                </div>
            </Space>
        );
    };

    const ConceptStatsByHare = () => {
        const { data, status } = useQuery(['conceptstatsbyhare', selectedConcepts], fetchConceptStatsByHare, queryConfig);

        if (status === 'loading') {
            return <Spinner />;
        }
        if (status === 'error') {
            return <React.Fragment>Error</React.Fragment>;
        }
        if (data) {
            // special case - endpoint returns empty result:
            if (data.concept_breakdown == null) {
                return <React.Fragment>Error: there are no subjects in this cohort that have data available on all the selected covariates
                    and phenotype. Please review your selections</React.Fragment>;
            }
            // normal scenario - there is breakdown data, so show in dropdown:
            return (
                <Dropdown buttonType='secondary' id='cohort-hare-selection-dropdown'>
                    <Dropdown.Button rightIcon='dropdown' buttonType='secondary'>
                        {selectedHare}
                    </Dropdown.Button>
                    <Dropdown.Menu>
                        {
                            data.concept_breakdown.map((datum) => {
                                return (
                                    <Dropdown.Item
                                        key={`${datum.concept_value}`}
                                        value={`${datum.concept_value}`}
                                        onClick={() => setSelectedHare(datum.concept_value)}
                                    >
                                        {<div>{datum.concept_value} {" (size:" + datum.persons_in_cohort_with_value + ")"}</div>}
                                    </Dropdown.Item>
                                );
                            })
                        }
                    </Dropdown.Menu>
                </Dropdown>
            );
        }
    };

    async function fetchGwasSubmit() {
        const submitEndpoint = `${gwasWorkflowPath}submit`;
        const requestBody = {
            n_pcs: numOfPC,
            covariates,
            out_prefix: Date.now().toString(),
            outcome: selectedOutcome,
            // hare_code: selectedHare, // TODO - align w/ Zuyi
            maf_threshold: Number(mafThreshold),
            imputation_score_cutoff: Number(imputationScore),
            template_version: "gwas-template-e4b5fa6bf50d7ccd6dcb058d225c1da674d67e5b",
            source_id: sourceId,
            case_cohort_definition_id: cohortDefinitionId,
            control_cohort_definition_id: "-1",
            workflow_name: gwasJobName
        };
        const res = await fetch(submitEndpoint, {
            method: 'POST',
            credentials: 'include',
            headers,
            body: JSON.stringify(requestBody),
        });
        return res;
    }

    const resetFields = () => {
        setCurrent(0);
        setNumOfPC(3);
        setSelectedOutcome([]);
        setCovariates([]);
        setSelectedConcepts([]);
        setSelectedConceptVars([]);
        setMafThreshold(0.01);
        setImputationScore(0.3);
        setCohortDefinitionId(undefined);
        setSelectedCohort(undefined);
        setSelectedHare("-select one-");
        setGwasJobName("");
        props.refreshWorkflows();
    };

    const useSubmitJob = () => {
        const openNotification = () => {
            const key = `open${Date.now()}`;
            const btn = (
                <Button type="primary" size="small" onClick={() => notification.close(key)}>
                    Confirm
                </Button>
            );
            notification.open({
                message: 'Successful Submission',
                description:
                    `${gwasJobName} job starting!`,
                icon: (<CheckOutlined />),
                placement: 'top',  // TODO: try to center this. antd seems to only have variations of top/bottom/left/right - https://ant.design/components/notification/
                btn,
                key,
            });
        };
        const submission = useMutation(fetchGwasSubmit, {
            onSuccess: () => {
                openNotification();
                resetFields();
            },
        });
        return submission;
    };

    const GWASFormSubmit = () => {
        const submitJob = useSubmitJob();

        const handleNameInputChange = (e) => {
            setGwasJobName(e.target.value);
        }

        return (
            <React.Fragment>
                <div className="GWASUI-flexRow GWASUI-headerColor"><h3 className="GWASUI-title">Review Details</h3></div>
                <div className="GWASUI-flexRow GWASUI-rowItem">
                    <div className="GWASUI-flexCol GWASUI-flexHeader1">Number of PCs</div>
                    <div className="GWASUI-flexCol">{numOfPC}</div>
                    <div className="GWASUI-flexCol GWASUI-flexHeader2">MAF Cutoff</div>
                    <div className="GWASUI-flexCol"> {mafThreshold}</div>
                </div>
                <div className="GWASUI-flexRow GWASUI-rowItem">
                    <div className="GWASUI-flexCol GWASUI-flexHeader1">HARE Ancestry</div>
                    <div className="GWASUI-flexCol">{selectedHare}</div>
                    <div className="GWASUI-flexCol GWASUI-flexHeader2">Imputation Score Cutoff</div>
                    <div className="GWASUI-flexCol">{imputationScore}</div>
                </div>
                <div className="GWASUI-flexRow GWASUI-rowItem">
                    <div className="GWASUI-flexCol GWASUI-flexHeader1">Selected Cohort</div>
                    <div className="GWASUI-flexCol">{selectedCohort?.cohort_name}</div>
                    <div className="GWASUI-flexCol GWASUI-flexHeader2">Phenotype</div>
                    <div className="GWASUI-flexCol">{selectedPhenotype?.concept_name}</div>
                </div>
                <div className="GWASUI-flexRow">
                    <div className="GWASUI-flexCol GWASUI-rowItem">Covariates</div>
                </div>
                <div className="GWASUI-flexRow">{selectedCovariates.map((cov, key) => {
                    return (
                        <div>
                            <li className="GWASUI-listItem" key={key}>{cov.concept_name}</li>
                        </div>
                    )
                })}</div>
                <div className="GWASUI-flexRow">
                    <input
                        type="text"
                        autoFocus="autoFocus"
                        className="GWASUI-nameInput"
                        onChange={handleNameInputChange}
                        value={gwasJobName}
                        placeholder="Enter a job name..."
                        style={{ width: '70%', height: '90%' }}
                    />
                    <div className="GWASUI-submitContainer">
                        <Button
                            htmlType='submit'
                            type='primary'
                            disabled={gwasJobName.length === 0}
                            onClick={(e) => {
                                e.stopPropagation();
                                submitJob.mutate();
                            }}
                        >
                            Submit
                        </Button></div>
                </div>
            </React.Fragment>
        );
    };

    const generateContentForStep = (stepIndex) => {
        switch (stepIndex) {
            case 0: {
                return (
                    sourceId ? <CohortDefinitions /> : null
                );
            }
            case 1: {
                return (
                    <CohortConcepts />
                );
            }
            case 2: {
                return (
                    <CohortConceptStats />
                );
            }
            case 3: {
                return (
                    <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
                        <h4 className="GWASUI-selectInstruction">In this step, you will determine workflow parameters.</h4>
                        <h4 className="GWASUI-selectInstruction">Please adjust the number of population principal components to control for population structure, minor allele frequency cutoff and imputation score cutoff. You may also remove unwanted covariates.</h4>
                        <h4 className="GWASUI-selectInstruction">Please also choose the ancestry population on which you would like to perform your study.</h4>
                        <div className='GWASUI-mainArea'>
                            <Form
                                name='GWASUI-parameter-form'
                                form={form}
                                labelCol={{
                                    span: 8,
                                }}
                                wrapperCol={{
                                    span: 16,
                                }}
                                initialValues={{
                                    numOfPC,
                                    mafCutoff: 0.01,
                                    imputationCutoff: 0.3,
                                }}
                                autoComplete='off'
                            >
                                <Form.Item
                                    label='Number of PCs to use'
                                    name='numOfPC'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input a value between 1 to 10',
                                        },
                                    ]}
                                >
                                    <InputNumber min={1} max={10} />
                                </Form.Item>
                                <Form.Item
                                    label='Covariates'
                                    name='covariates'
                                >
                                    <Select
                                        mode='multiple'
                                        value={selectedCovariates.map((s) => s.concept_name)}
                                        disabled={selectedCovariates.length === 1}
                                        onChange={(e) => handleCovariateDelete(e)}
                                        style={{ width: '70%' }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label='Phenotype'
                                    name='outcome'
                                >
                                    <Input
                                        disabled
                                        value={selectedPhenotype}
                                        style={{ width: '70%' }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label='Select HARE group'
                                    name='hareGroup'
                                >
                                    <ConceptStatsByHare />
                                </Form.Item>
                                <Form.Item
                                    label='MAF Cutoff'
                                    name='mafCutoff'
                                >
                                    <InputNumber value={mafThreshold} onChange={(e) => setMafThreshold(e)} stringMode step='0.01' min={'0'} max={'0.5'} />
                                </Form.Item>
                                <Form.Item
                                    label='Imputation Score Cutoff'
                                    name='imputationCutoff'
                                >
                                    <InputNumber value={imputationScore} onChange={(e) => setImputationScore(e)} stringMode step='0.1' min={'0'} max={'1'} />
                                </Form.Item>
                            </Form>
                        </div>
                    </Space>
                );
            }
            case 4: {
                const layout = {
                    labelCol: { span: 8 },
                    wrapperCol: { span: 16 },
                };
                const tailLayout = {
                    wrapperCol: { offset: 8, span: 16 },
                };

                return (
                    <React.Fragment>
                        <h4 className="GWASUI-selectInstruction">In this step, you may review your selections for the study, give a name to the study, and submit the GWAS for analysis.</h4>
                        <h4 className="GWASUI-selectInstruction">Upon submission you may review the status of the job in the ‘Submitted Job Status’ in this App above the enumerated steps (dropdown menu).</h4>
                        <div className='GWASUI-mainArea'>
                            <Form
                                {...layout}
                                name='control-hooks'
                                form={form}
                                onFinish={(values) => {
                                    onStep5FormSubmit(values);
                                }}
                            >
                                {/* <Form.Item {...tailLayout}> */}
                                <GWASFormSubmit refreshWorkflows={props.refreshWorkflows} />
                                {/* </Form.Item> */}
                            </Form>
                        </div>
                    </React.Fragment>
                );
            }
            default:
                return <React.Fragment />;
        }
    };

    let nextButtonEnabled = true;
    if (current === 0 && !selectedCohort) {
        nextButtonEnabled = false;
    } else if (current === 1 && selectedConcepts.length < 2) {
        nextButtonEnabled = false;
    } else if (current === 2) {
        // next button enabled if selected phenotype array length > 0
        nextButtonEnabled = !!selectedPhenotype;
    }

    return (
        <Space direction={'vertical'} style={{ width: '100%' }}>
            <GWASWorkflowList refreshWorkflows={props.refreshWorkflows} />
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
                {/* added so "select diff gwas" btn retains center position on last page */}
                {current === steps.length - 1 && (<div className="GWASUI-navBtn"></div>)}
            </div>
        </Space>
    );
}

QuantitativeGWAS.propTypes = {
    refreshWorkflows: PropTypes.func.isRequired,
};

export default QuantitativeGWAS;
