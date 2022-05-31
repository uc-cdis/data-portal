import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Steps, Button, Space, Table, Input, Form, InputNumber, Select, Switch, Popconfirm
} from 'antd';
import './GWASUIApp.css';
import { useQuery, useQueries, useMutation } from 'react-query';
import { headers, fetchAndSetCsrfToken } from '../../configs';
import { gwasWorkflowPath, cohortMiddlewarePath, wtsPath } from '../../localconf';
import GWASWorkflowList from './GWASWorkflowList';
import { fetchWithCreds } from '../../actions';
import Spinner from "../../components/Spinner";

// the quantitative argo id is
// gwas-template-wrapper-k5w9t and the tar GUID is dg.VA03/7484ce92-313b-4286-954c-b71ad5d9bf54

const { Step } = Steps;

const steps = [
    {
        title: 'Step 1',
        description: 'Select a case cohort for GWAS',
    },
    {
        title: 'Step 2',
        description: 'Select a control cohort for GWAS',
    },
    {
        title: 'Step 3',
        description: 'Select harmonized variables for covariates',
    },
    {
        title: 'Step 4',
        description: 'Review your covariate selections',
    },
    {
        title: 'Step 5',
        description: 'Set workflow parameters and remove unwanted covariates',
    },
    {
        title: 'Step 6',
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
    const [sourceId, setSourceId] = useState(0);
    const [caseCohortDefinitionId, setCaseCohortDefinitionId] = useState(undefined);
    const [selectedCaseCohort, setSelectedCaseCohort] = useState(undefined);
    const [controlCohortDefinitionId, setControlCohortDefinitionId] = useState(undefined);
    const [selectedControlCohort, setSelectedControlCohort] = useState(undefined);
    const [caseCohortName, setCaseCohortName] = useState(undefined);

    const [covariateVars] = useState({
        ConceptIds: [2000006886, 2000000280, 2000000895, 2000000914, 2000000900, 2000000846, 2000000872, 2000000873, 2000000874, 2000006885, 2000000708],
    });

    const [form] = Form.useForm();

    const [selectedCovariates, setSelectedCovariates] = useState([]);
    const [selectedCovariateIds, setSelectedCovariateIds] = useState([]);
    const [selectedCovariateVars, setSelectedCovariateVars] = useState([]);

    const [imputationScore, setImputationScore] = useState(0.3);
    const [mafThreshold, setMafThreshold] = useState(0.01);
    const [numOfPC, setNumOfPC] = useState(3);
    const [selectedCaseHare, setSelectedCaseHare] = useState(undefined);
    const [selectedControlHare, setSelectedControlHare] = useState(undefined);

    async function fetchSources() {
        const sourcesEndpoint = `${cohortMiddlewarePath}sources`;
        const getSources = await fetch(sourcesEndpoint);
        return getSources.json();
    }

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

    async function fetchCohortDefinitions() {
        const cohortEndPoint = `${cohortMiddlewarePath}cohortdefinition-stats/by-source-id/${sourceId}`;
        const getCohortDefinitions = await fetch(cohortEndPoint);
        return getCohortDefinitions.json();
    }

    async function fetchCovariates() {
        const conceptEndpoint = `${cohortMiddlewarePath}concept/by-source-id/${sourceId}`;
        const reqBody = {
            method: 'POST',
            credentials: 'include',
            headers,
            body: JSON.stringify(covariateVars),
        };
        const getCovariates = await fetch(conceptEndpoint, reqBody);
        return getCovariates.json();
    }

    async function fetchCaseConceptStatsByHare() {
        const conceptIds = [...selectedCovariates].map((val) => val.concept_id);
        const conceptIdsPayload = { ConceptIds: conceptIds };
        const conceptStatsEndPoint = `${cohortMiddlewarePath}concept-stats/by-source-id/${sourceId}/by-cohort-definition-id/${caseCohortDefinitionId}/breakdown-by-concept-id/${hareConceptId}`;
        const reqBody = {
            method: 'POST',
            credentials: 'include',
            headers,
            body: JSON.stringify(conceptIdsPayload),
        };
        const getConceptStats = await fetch(conceptStatsEndPoint, reqBody);
        return getConceptStats.json();
    }

    async function fetchControlConceptStatsByHare() {
        const conceptIds = [...selectedCovariates].map((val) => val.concept_id);
        const conceptIdsPayload = { ConceptIds: conceptIds };
        const conceptStatsEndPoint = `${cohortMiddlewarePath}concept-stats/by-source-id/${sourceId}/by-cohort-definition-id/${controlCohortDefinitionId}/breakdown-by-concept-id/${hareConceptId}`;
        const reqBody = {
            method: 'POST',
            credentials: 'include',
            headers,
            body: JSON.stringify(conceptIdsPayload),
        };
        const getConceptStats = await fetch(conceptStatsEndPoint, reqBody);
        return getConceptStats.json();
    }

    const step1TableRowSelection = {
        type: 'radio',
        columnTitle: 'Select',
        selectedRowKeys: (selectedCaseCohort) ? [selectedCaseCohort.cohort_definition_id] : [],
        onChange: (_, selectedRows) => {
            setSelectedCaseCohort(selectedRows[0]);
            setCaseCohortDefinitionId(selectedRows[0].cohort_definition_id);
            setCaseCohortName(selectedRows[0].cohort_name);
        },
        getCheckboxProps: (record) => ({
            disabled: record.size === 0,
        }),
    };

    const step2TableRowSelection = {
        type: 'radio',
        columnTitle: 'Select',
        selectedRowKeys: (selectedControlCohort) ? [selectedControlCohort.cohort_definition_id] : [],
        onChange: (_, selectedRows) => {
            setSelectedControlCohort(selectedRows[0]);
            setControlCohortDefinitionId(selectedRows[0].cohort_definition_id);
        },
        getCheckboxProps: (record) => ({
            disabled: record.size === 0 || record.cohort_name === caseCohortName,
        }),
    };


    const step3TableRowSelection = {
        type: 'checkbox',
        columnTitle: 'Select',
        selectedRowKeys: selectedCovariates.map((val) => val.concept_id),
        onChange: (_, selectedRows) => {
            setSelectedCovariateVars(selectedRows.map((item) => item.concept_id));
            setSelectedCovariates(selectedRows);
        },
    };


    const step1And2TableConfig = [
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

    const step3TableConfig = [
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

    const CaseCohortDefinition = () => {
        const { data, status } = useQuery(['cohortdefinitions', sourceId], fetchCohortDefinitions, queryConfig);

        if (status === 'loading') {
            return <Spinner />;
        }
        if (status === 'error') {
            return <React.Fragment>Error</React.Fragment>;
        }
        return (
            <React.Fragment>
                <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
                    <div className='GWASUI-mainTable'>
                        <Table
                            className='GWASUI-table1'
                            rowKey='cohort_definition_id'
                            size='middle'
                            pagination={{ pageSize: 10 }}
                            rowSelection={step1TableRowSelection}
                            columns={step1And2TableConfig}
                            dataSource={data.cohort_definitions_and_stats.filter((x) => x.size > 0)} // many entries w/ size 0 in prod
                        />
                    </div>
                </Space>
            </React.Fragment>
        );
    };

    const ControlCohortDefinition = () => {
        const { data, status } = useQuery(['cohortdefinitions', sourceId], fetchCohortDefinitions, queryConfig);

        if (status === 'loading') {
            return <Spinner />;
        }
        if (status === 'error') {
            return <React.Fragment>Error</React.Fragment>;
        }
        return (
            <React.Fragment>
                <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
                    <div className='GWASUI-mainTable'>
                        <Table
                            className='GWASUI-table1'
                            rowKey='cohort_definition_id'
                            size='middle'
                            pagination={{ pageSize: 10 }}
                            rowSelection={step2TableRowSelection}
                            columns={step1And2TableConfig}
                            dataSource={data.cohort_definitions_and_stats.filter((x) => x.size > 0)} // many entries w/ size 0 in prod
                        />
                    </div>
                </Space>
            </React.Fragment>
        );
    };

    const CohortCovariates = () => {
        const { data, status } = useQuery(['cohortcovariates', sourceId], fetchCovariates, queryConfig);

        if (status === 'loading') {
            return <Spinner />;
        }
        if (status === 'error') {
            return <React.Fragment>Error</React.Fragment>;
        }

        return (
            <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
                <h4 className='GWASUI-selectInstruction'>Select one or more covariates</h4>
                <div className='GWASUI-mainTable'>
                    <Table
                        className='GWASUI-table2'
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

    function fetchConceptStatsCase() {
        return fetchConceptStats(caseCohortDefinitionId);
    }

    function fetchConceptStatsControl() {
        return fetchConceptStats(controlCohortDefinitionId);
    }

    async function fetchConceptStats(cohortDefinitionId) {
        const conceptStatsVars = { ConceptIds: selectedCovariateVars };
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

    const step4TableConfig = [
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
            title: 'Missing in Case',
            dataIndex: 'n_missing_ratio_case',
            key: 'n_missing_ratio_case',
            render: (_, record) => (
                <span>{`${(record.n_missing_ratio_case * 100).toFixed(0)}%`}</span>
            ),
        },
        {
            title: 'Missing in Control',
            dataIndex: 'n_missing_ratio_control',
            key: 'n_missing_ratio_control',
            render: (_, record) => (
                <span>{`${(record.n_missing_ratio_control * 100).toFixed(0)}%`}</span>
            ),
        },
    ];

    function getMissingRatioForControl(concept_id, concepts) {
        // iterate over concepts and return the n_missing_ratio for the
        // concept where concept_id matches the givent concept_id
        for (const concept_idx in concepts) {
            const concept = concepts[concept_idx];
            if (concept.concept_id === concept_id) {
                return concept.n_missing_ratio;
            }
        }
        throw Exception("Unexpected error: concept id not found on control set!");
    }

    const ReviewCovariates = () => {
        const results = useQueries([
            { queryKey: ['cohortstats', selectedCovariates, caseCohortDefinitionId], queryFn: fetchConceptStatsCase },
            { queryKey: ['cohortstats', selectedCovariates, controlCohortDefinitionId], queryFn: fetchConceptStatsControl },
          ]);
        const statusCase = results[0].status;
        const statusControl = results[1].status;
        const dataCase = results[0].data;
        const dataControl = results[1].data;

        if (statusCase === 'loading' || statusControl === 'loading') {
            return <Spinner />;
        }
        if (statusCase === 'error' || statusControl === 'error') {
            return <React.Fragment>Error</React.Fragment>;
        }
        if (dataCase && dataControl) {
            // fuse both datasets by adding a new "n_missing_ratio_control" attribute to dataCase based on
            // what is found in dataControl for the same concept:
            for (const concept_idx in dataCase.concepts) {
                const concept = dataCase.concepts[concept_idx];
                concept.n_missing_ratio_case = concept.n_missing_ratio;
                concept.n_missing_ratio_control = getMissingRatioForControl(concept.concept_id, dataControl.concepts);
            }
            // after loop above, dataCase contains both case and control stats:
            const data = dataCase;
            return (
                <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
                    <hr />
                    <h4 className='GWASUI-selectInstruction'>Review your covariates</h4>
                    <div className='GWASUI-mainTable'>
                        <Table
                            className='GWASUI-review-table'
                            rowKey='concept_id'
                            pagination={{ pageSize: 10 }}
                            columns={step4TableConfig}
                            dataSource={data.concepts}
                        />
                    </div>
                </Space>
            );
        }
    };

    const ConceptStatsByHare = (gwasType) => {
        const { data, status } = useQuery(['conceptstatsbyhare', selectedCovariates], gwasType === "case" ? fetchCaseConceptStatsByHare : fetchControlConceptStatsByHare, queryConfig);

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
                                        onClick={() => {
                                            gwasType === "case" ? setSelectedCaseHare(datum.concept_value) : setSelectedControlHare(datum.concept_value)
                                            }
                                        }
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

    const handleCovariateDelete = (remainingCovariates) => {
        const remainingCovArr = [];
        remainingCovariates.forEach((name) => {
            selectedCovariates.forEach((covObj) => {
                if (covObj.concept_name === name) {
                    remainingCovArr.push(covObj);
                }
            });
        });
        setSelectedCovariateIds(remainingCovArr.map((c) => c.prefixed_concept_id));
        setSelectedCovariates(remainingCovArr);
        setSelectedCovariateVars(remainingCovArr.map((c) => c.concept_id));
        form.setFieldsValue({
            covariates: remainingCovariates,
        });
    };

    async function fetchGwasSubmit() {
        const submitEndpoint = `${gwasWorkflowPath}submit`;
        const requestBody = {
            n_pcs: numOfPC,
            covariates,
            out_prefix: Date.now().toString(),
            outcome: "-1",
            // hare_codes: // TODO
            maf_threshold: Number(mafThreshold),
            imputation_score_cutoff: Number(imputationScore),
            // template_version: 'gwas-template-6226080403eb62585981d9782aec0f3a82a7e906',
            source_id: sourceId,
            case_cohort_definition_id: selectedCaseCohort,
            control_cohort_definition_id: selectedControlCohort,
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
        setSelectedCovariates([]);
        setSelectedCovariateIds([]);
        setMafThreshold(0.01);
        setImputationScore(0.3);
        setCaseCohortDefinitionId(undefined);
        setControlCohortDefinitionId(undefined);
        setCaseCohortName(undefined);
        setSelectedControlCohort(undefined);
        setSelectedCaseCohort(undefined);
        setSelectedCaseHare("-select one-");
        setSelectedControlHare("-select one-")
        // props.refreshWorkflows();
    };

    // const useSubmitJob = () => {
    //     const submission = useMutation(fetchGwasSubmit, {
    //         onSuccess: () => {
    //             resetFields();
    //         },
    //     });
    //     return submission;
    // };

    const CohortParameters = () => {
        return (
            <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
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
                            isBinary: false,
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
                            label='Select HARE group'
                            name='hareGroup'
                        >
                            <ConceptStatsByHare gwasType={"case"} />
                            <ConceptStatsByHare gwasType={"control"} />
                        </Form.Item>
                        <Form.Item
                            label='Is Binary Outcome?'
                            name='isBinary'
                        >
                            <Switch disabled checked={false} style={{ width: '5%' }} />
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
        )
    }

    const generateContentForStep = (stepIndex) => {
        switch (stepIndex) {
            case 0: {
                return (
                    sourceId ? <CaseCohortDefinition></CaseCohortDefinition> : <Spinner></Spinner>
                );
            }
            case 1: {
                return (
                    <ControlCohortDefinition></ControlCohortDefinition>
                );
            }
            case 2: {
                return (
                    <CohortCovariates></CohortCovariates>
                );
            }
            case 3: {
                return (
                    <ReviewCovariates></ReviewCovariates>
                );
            }
            case 4: {
                return (
                    <CohortParameters></CohortParameters>
                );
            }
            case 5: {
                return (
                    <span>step 6</span>
                );
            }
        }
    }

    const handleNextStep = () => {
        if (current === 1) {
            // setSelectedCovariates([...selectedConcepts].slice(1).map((val) => val.prefixed_concept_id));
            // setSelectedOutcome(selectedConcepts[0].prefixed_concept_id);

            // form.setFieldsValue({
            //     covariates: [...selectedConcepts].slice(1).map((val) => val.concept_name),
            //     outcome: selectedConcepts[0].concept_name,
            // });
        }
        if (current === 4) {
            form.submit();
        }
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
