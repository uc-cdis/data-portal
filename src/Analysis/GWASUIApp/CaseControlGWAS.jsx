import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Steps, Button, Space, Table, Input, Form, InputNumber, Select, Switch, Popconfirm, notification
} from 'antd';
import './GWASUIApp.css';
import { useQuery, useQueries, useMutation } from 'react-query';
import { headers, fetchAndSetCsrfToken } from '../../configs';
import { gwasWorkflowPath, cohortMiddlewarePath, wtsPath } from '../../localconf';
import GWASWorkflowList from './GWASWorkflowList';
import { fetchWithCreds } from '../../actions';
import Spinner from "../../components/Spinner";
import Dropdown from '@gen3/ui-component/dist/components/Dropdown';
import CheckOutlined from '@ant-design/icons';
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
        description: 'Assess % missing in selected covariates',
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
    const [controlCohortName, setControlCohortName] = useState(undefined);

    const [allowedConceptTypes] = useState({
        ConceptTypes: ['MVP Continuous'],
    });

    const [form] = Form.useForm();

    const [selectedCovariates, setSelectedCovariates] = useState([]);
    const [selectedCovariateIds, setSelectedCovariateIds] = useState([]);
    const [selectedCovariateVars, setSelectedCovariateVars] = useState([]);

    const [imputationScore, setImputationScore] = useState(0.3);
    const [mafThreshold, setMafThreshold] = useState(0.01);
    const [numOfPC, setNumOfPC] = useState(3);
    const [selectedHare, setSelectedHare] = useState('');
    const [selectedHareDescription, setSelectedHareDescription] = useState('-select one of the ancestry groups below-');
    const [selectedHareValueAsConceptId, setSelectedHareValueAsConceptId] = useState(0);

    const [selectedCaseSize, setSelectedCaseSize] = useState(0);
    const [selectedControlSize, setSelectedControlSize] = useState(0);

    const [gwasJobName, setGwasJobName] = useState("");
    const hareConceptId = 2000007027;

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
        const conceptEndpoint = `${cohortMiddlewarePath}concept/by-source-id/${sourceId}/by-type`;
        const reqBody = {
            method: 'POST',
            credentials: 'include',
            headers,
            body: JSON.stringify(allowedConceptTypes),
        };
        const getCovariates = await fetch(conceptEndpoint, reqBody);
        // TODO - see https://github.com/TanStack/query/issues/2258#issuecomment-1034889517
        // and https://react-query.tanstack.com/guides/query-functions#usage-with-fetch-and-other-clients-that-do-not-throw-by-default
        // Maybe add this to avoid repeated calls when getting 4** errors?
        // if (!getCovariates.ok) {
        //     throw new Error('Error while fetching covariates');
        // }
        return getCovariates.json();
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
            setControlCohortName(selectedRows[0].cohort_name);
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
            form.setFieldsValue({
                covariates: selectedRows.map((val) => val.concept_name),
            });
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
                <h4 className="GWASUI-selectInstruction">In this step, you will begin to define the study population. To begin, select the cohort that you would like to define as your study “cases” population.</h4>
                <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
                <button onClick={() => window.open(cohortMiddlewarePath.replace('cohort-middleware', 'analysis/OHDSI%20Atlas'), '_blank')}>+ Add a new cohort</button>
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
                {/* window.open(`${}`, '_blank') */}
                 <h4 className="GWASUI-selectInstruction">In this step, you will continue to define the study population. Please select the cohort that you would like to define as your study “control” population.</h4>
                <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
                <button onClick={() => window.open(cohortMiddlewarePath.replace('cohort-middleware', 'analysis/OHDSI%20Atlas'), '_blank')}>+ Add a new cohort</button>
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

    const Covariates = () => {
        const { data, status } = useQuery(['covariates', allowedConceptTypes.ConceptTypes, sourceId], fetchCovariates, queryConfig);

        if (status === 'loading') {
            return <Spinner />;
        }
        if (status === 'error') {
            return <React.Fragment>Error</React.Fragment>;
        }

        if (data.concepts.length === 0) {
            return <React.Fragment>Unexpected error: no convariates found!</React.Fragment>;
        }
        return (
            <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
                <h4 className='GWASUI-selectInstruction'>In this step, you will select covariates for your study. Please choose any of the harmonized variables.</h4>
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


    const fetchConceptStats = async (cohortDefinitionId) => {
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


    function fetchConceptStatsCase() {
        return fetchConceptStats(caseCohortDefinitionId);
    }

    function fetchConceptStatsControl() {
        return fetchConceptStats(controlCohortDefinitionId);
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
            { queryKey: ['cohortstats', selectedCovariates, caseCohortDefinitionId], queryFn: fetchConceptStatsCase, ...queryConfig },
            { queryKey: ['cohortstats', selectedCovariates, controlCohortDefinitionId], queryFn: fetchConceptStatsControl, ...queryConfig },
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
                    <h4 className='GWASUI-selectInstruction'>In this step, you can review the covariates selection based on % missing metrics. To adjust covariates please return to Step 3. </h4>
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

    async function fetchConceptStatsByHare(cohortDefinitionId) {
        var conceptIds = [...selectedCovariates].map((val) => val.concept_id);
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

    function fetchCaseConceptStatsByHare() {
        return fetchConceptStatsByHare(caseCohortDefinitionId);
    }

    function fetchControlConceptStatsByHare() {
        return fetchConceptStatsByHare(controlCohortDefinitionId);
    }

    const getSelectedCaseAndControlBreakdownItems = (concept_value, allCaseHareBreakDownItems, allControlHareBreakDownItems) => {
        var selecteCasedHareBreakDownItem = null;
        var selecteControlHareBreakDownItem = null;
        for (let hareBreakDownItem of allCaseHareBreakDownItems) {
          if (hareBreakDownItem.concept_value === concept_value) {
            selecteCasedHareBreakDownItem = hareBreakDownItem;
            break;
          }
        }
        for (let hareBreakDownItem of allControlHareBreakDownItems) {
            if (hareBreakDownItem.concept_value === concept_value) {
                selecteControlHareBreakDownItem = hareBreakDownItem;
              break;
            }
        }
        return [selecteCasedHareBreakDownItem, selecteControlHareBreakDownItem];
    }

    const getHareAndDescriptionUsingValueAndBreakDownItems = (concept_value, allCaseHareBreakDownItems, allControlHareBreakDownItems) => {
        const selectedBreakDownItems = getSelectedCaseAndControlBreakdownItems(concept_value,
            allCaseHareBreakDownItems, allControlHareBreakDownItems);
        const selecteCasedHareBreakDownItem = selectedBreakDownItems[0];
        const selecteControlHareBreakDownItem = selectedBreakDownItems[1];
        return getHareAndDescription(selecteCasedHareBreakDownItem.concept_value_name,
            selecteCasedHareBreakDownItem.persons_in_cohort_with_value,
            selecteControlHareBreakDownItem.persons_in_cohort_with_value);
    }

    const getHareAndDescription = (concept_value_name, case_cohort_size, control_cohort_size) => {
        return `${concept_value_name} (sizes: ${case_cohort_size}, ${control_cohort_size})`;
    }

    const setSelectedHareAndDescription = (concept_value, allCaseHareBreakDownItems, allControlHareBreakDownItems) => {
        setSelectedHare(concept_value);
        const selectedBreakDownItems = getSelectedCaseAndControlBreakdownItems(concept_value,
            allCaseHareBreakDownItems, allControlHareBreakDownItems);
        const selecteCasedHareBreakDownItem = selectedBreakDownItems[0];
        const selecteControlHareBreakDownItem = selectedBreakDownItems[1];
        setSelectedHareDescription(getHareAndDescription(selecteCasedHareBreakDownItem.concept_value_name,
            selecteCasedHareBreakDownItem.persons_in_cohort_with_value,
            selecteControlHareBreakDownItem.persons_in_cohort_with_value));
        setSelectedCaseSize(selecteCasedHareBreakDownItem.persons_in_cohort_with_value);
        setSelectedHareValueAsConceptId(selecteCasedHareBreakDownItem.concept_value_as_concept_id);
        setSelectedControlSize(selecteControlHareBreakDownItem.persons_in_cohort_with_value);
      }

    const ConceptsStatsByHare = () => {
        const results = useQueries([
            { queryKey: ['conceptsstats', selectedCovariates, caseCohortDefinitionId], queryFn: fetchCaseConceptStatsByHare, ...queryConfig },
            { queryKey: ['conceptsstats', selectedCovariates, controlCohortDefinitionId], queryFn: fetchControlConceptStatsByHare, ...queryConfig },
        ]);
        // const { data, status } = useQuery(['conceptstatsbyhare', selectedCovariates], gwasType === "case" ? fetchCaseConceptStatsByHare : fetchControlConceptStatsByHare, queryConfig);
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
        if (dataControl && dataCase) {
            // special case - endpoint returns empty result:
            if (dataControl.concept_breakdown == null || dataCase.concept_breakdown == null) {
                return <React.Fragment>Error: there are no subjects in this cohort that have data available on all the selected covariates
                    and phenotype. Please review your selections</React.Fragment>;
            }
            // normal scenario - there is breakdown data, so show in dropdown:
            if (selectedHare != '') {
                setSelectedHareAndDescription(selectedHare, dataCase.concept_breakdown, dataControl.concept_breakdown)
              }
            return (
                <div className="GWASUI-flexRow">
                    <Dropdown buttonType='secondary' id='cohort-hare-selection-dropdown'>
                        <Dropdown.Button rightIcon='dropdown' buttonType='secondary'>
                            {selectedHareDescription}
                        </Dropdown.Button>
                        <Dropdown.Menu>
                            {
                                dataCase.concept_breakdown.map((datum) => {
                                    return (
                                        <Dropdown.Item
                                            key={`${datum.concept_value}`}
                                            value={`${datum.concept_value}`}
                                            onClick={() => setSelectedHareAndDescription(datum.concept_value, dataCase.concept_breakdown, dataControl.concept_breakdown)
                                            }
                                        >
                                            {<div>{getHareAndDescriptionUsingValueAndBreakDownItems(datum.concept_value, dataCase.concept_breakdown, dataControl.concept_breakdown)}</div>}
                                        </Dropdown.Item>
                                    );
                                })
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            );
        }
    };

    async function fetchOverlapInfo() {
        var conceptIds = [...selectedCovariates].map((val) => val.concept_id);
        const conceptIdsPayload = { ConceptIds: conceptIds };
        const statsEndPoint = `${cohortMiddlewarePath}cohort-stats/check-overlap/by-source-id/${sourceId}/by-case-control-cohort-definition-ids/${caseCohortDefinitionId}/${controlCohortDefinitionId}/filter-by-concept-id-and-value/${hareConceptId}/${selectedHareValueAsConceptId}`;
        const reqBody = {
            method: 'POST',
            credentials: 'include',
            headers,
            body: JSON.stringify(conceptIdsPayload),
        };
        const getOverlapStats = await fetch(statsEndPoint, reqBody);
        return getOverlapStats.json();
    }

    const QCShowOverlap = () => {
        const { data, status } = useQuery(['checkoverlap', sourceId, caseCohortDefinitionId, controlCohortDefinitionId, hareConceptId, selectedHare, selectedCovariates], fetchOverlapInfo, queryConfig);

        if (status === 'loading') {
            return <Spinner />;
        }
        if (status === 'error') {
            return <React.Fragment>Error</React.Fragment>;
        }

        if (data.cohort_overlap.case_control_overlap_after_filter === 0) {
            return (
                <div className="GWASUI-flexCol">
                    Based on the selected covariates their respective data within the study population,<br/>
                    {selectedCaseSize} subjects were found in {caseCohortName} cohort and <br/>
                    {selectedControlSize} subjects were found in {controlCohortName} cohort.<br/>
                    <strong style={{color: '#006644'}}>No overlap found between both cohorts.</strong>
                </div>
            );
        } else {
            // display an error message if there is any overlap between case and control populations:
            return (
                <div className="GWASUI-flexCol">
                    Based on the selected covariates their respective data within the study population,<br/>
                    {selectedCaseSize} subjects were found in <b>{caseCohortName}</b> cohort and <br/>
                    {selectedControlSize} subjects were found in <b>{controlCohortName}</b> cohort.<br/>
                    <strong style={{color: '#bf2600'}}>Warning: overlap found between both cohorts!<br/>
                    ({data.cohort_overlap.case_control_overlap_after_filter} subjects were found to be present in both cohorts).<br/>
                    Please review your selections.<br/>
                    If you choose to continue, be aware that these {data.cohort_overlap.case_control_overlap_after_filter} subjects will <i>not</i> be considered in the analysis.
                    </strong>
                </div>
            );

        }

    };

    async function fetchGwasSubmit() {
        const submitEndpoint = `${gwasWorkflowPath}submit`;
        const requestBody = {
            n_pcs: numOfPC,
            covariates: selectedCovariates.map((val) => val.prefixed_concept_id),
            out_prefix: Date.now().toString(),
            outcome: "-1",
            hare_population: selectedHare,
            hare_concept_id: hareConceptId,
            maf_threshold: Number(mafThreshold),
            imputation_score_cutoff: Number(imputationScore),
            template_version: "gwas-template-latest",
            source_id: sourceId,
            case_cohort_definition_id: caseCohortDefinitionId,
            control_cohort_definition_id: controlCohortDefinitionId,
            workflow_name: gwasJobName,
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
        setControlCohortName(undefined);
        setSelectedControlCohort(undefined);
        setSelectedCaseCohort(undefined);
        setSelectedHare('');
        setSelectedHareDescription('-select one of the ancestry groups below-');
        setSelectedHareValueAsConceptId(0);
        setGwasJobName('');
        props.refreshWorkflows();
    };

    const CohortParameters = () => {
        return (
            <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
                <h4 className="GWASUI-selectInstruction">In this step, you will determine workflow parameters. Please adjust the number of population principal components to control for population structure, minor allele frequency cutoff and imputation score cutoff.</h4>
                <h4 className="GWASUI-selectInstruction">You may also remove unwanted covariates. Please also choose the ancestry population on which you would like to perform your study.</h4>
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
                            label='Select HARE group'
                            name='hareGroup'
                        >
                            <ConceptsStatsByHare />
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
                placement: 'top',
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

        return (<React.Fragment>
            <div className="GWASUI-flexRow GWASUI-headerColor"><h3 className="GWASUI-title">Review Details</h3></div>
            <div className="GWASUI-flexRow GWASUI-rowItem">
                <div className="GWASUI-flexCol GWASUI-flexHeader1">Number of PCs</div>
                <div className="GWASUI-flexCol">{numOfPC}</div>
                <div className="GWASUI-flexCol GWASUI-flexHeader2">MAF Cutoff</div>
                <div className="GWASUI-flexCol"> {mafThreshold}</div>
            </div>
            <div className="GWASUI-flexRow GWASUI-rowItem">
                <div className="GWASUI-flexCol GWASUI-flexHeader1">HARE Ancestry</div>
                <div className="GWASUI-flexCol">{selectedHareDescription}</div>
                <div className="GWASUI-flexCol GWASUI-flexHeader2">Imputation Score Cutoff</div>
                <div className="GWASUI-flexCol">{imputationScore}</div>
            </div>
            <div className="GWASUI-flexRow GWASUI-rowItem">
                <div className="GWASUI-flexCol GWASUI-flexHeader1">Selected Case Cohort</div>
                <div className="GWASUI-flexCol">{selectedCaseCohort?.cohort_name}</div>
                <div className="GWASUI-flexCol GWASUI-flexHeader2">Selected Control Cohort</div>
                <div className="GWASUI-flexCol">{selectedControlCohort?.cohort_name}</div>
            </div>
            <div className="GWASUI-flexRow GWASUI-rowItem">
                <div className="GWASUI-flexCol">Covariates</div>
                <div className="GWASUI-flexCol">{selectedCovariates.map((cov, key) => {
                    return (
                        <div>
                            <li className="GWASUI-listItem" key={key}>{cov.concept_name}</li>
                        </div>
                    )
                })}</div>
            </div>
            <div className="GWASUI-flexRow GWASUI-rowItem">
                <QCShowOverlap/>
            </div>
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
        </React.Fragment>)
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
                    <Covariates></Covariates>
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
                const layout = {
                    labelCol: { span: 8 },
                    wrapperCol: { span: 16 },
                };
                return (
                    <React.Fragment>
                         <h4 className="GWASUI-selectInstruction">In this step, you may review the metadata selected for the study, give a name to the study, and submit the GWAS for analysis.</h4>
                         <h4 className="GWASUI-selectInstruction">Upon submission you may review the status of the job in the ‘Submitted Job Status’ in this App above the enumerated steps</h4>
                    <div className='GWASUI-mainArea'>
                        <Form
                            {...layout}
                            name='control-hooks'
                            form={form}
                            onFinish={(values) => {
                                onStep5FormSubmit(values);
                            }}
                        >
                            <GWASFormSubmit refreshWorkflows={props.refreshWorkflows} />
                        </Form>
                    </div>
                    </React.Fragment>

                );
            }
        }
    }

    const handleCovariateDelete = (remainingCovariates) => {
        const remainingCovArr = [];
        remainingCovariates.forEach((name) => {
            selectedCovariates.forEach((covObj) => {
                if (covObj.concept_name === name) {
                    remainingCovArr.push(covObj);
                }
            });
        });
        setSelectedCovariates(remainingCovArr);
        setSelectedCovariateVars(remainingCovArr.map((c) => c.concept_id));
        setSelectedCovariateIds(remainingCovArr.map((p) => p.prefixed_concept_id));
        form.setFieldsValue({
            covariates: remainingCovArr.map((val) => val.concept_name)
        });
    };


    const onStep5FormSubmit = (values) => {
        setImputationScore(values.imputationCutoff);
        setMafThreshold(values.mafCutoff);
        setNumOfPC(values.numOfPC);
    };

    const handleNextStep = () => {
        if (current === 1) {
            setSelectedCovariates([...selectedCovariates].map((val) => val.prefixed_concept_id));

            form.setFieldsValue({
                covariates: [...selectedCovariates].map((val) => val.concept_name),
            });
        }
        if (current === 4) {
            form.submit();
        }
        // based off current, make changes to local state variables
    }

    let nextButtonEnabled = true;
    if ((current === 0 && !selectedCaseCohort) || (current === 1 && !selectedControlCohort)) {
      // Cohort selection
      nextButtonEnabled = false;
    } else if (current === 2 && selectedCovariates.length < 1) {
      // covariate selection
      nextButtonEnabled = false;
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
                        disabled={!nextButtonEnabled} // TODO: update nextButtonEnabled logic to disable when necessary. right now its just defaulted true
                    >
                        Next
                    </Button>
                )}
                {/* added so "select diff gwas" btn retains center position on last page */}
                {current === steps.length - 1 && (<div className="GWASUI-navBtn"></div>)}
            </div>
        </Space>
    )
}

CaseControlGWAS.propTypes = {
    // TODO: different workflows refresh?
}

export default CaseControlGWAS;
