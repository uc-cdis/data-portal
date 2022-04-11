import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Steps, Button, Space, Table, Input, Modal, Collapse, List, Tag, Form, Result, Alert, Popconfirm, InputNumber, Select, Checkbox, Switch
} from 'antd';
import './GWASUIApp.css';
import { headers, fetchAndSetCsrfToken } from '../../configs';
import { gwasWorkflowPath, cohortMiddlewarePath } from '../../localconf';
import GWASWorkflowList from './GWASWorkflowList';

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
    description: 'Select which variable is your phenotype and remove unwanted covariates',
  },
  {
    title: 'Step 4',
    description: 'Set workflow parameters',
  },
  {
    title: 'Step 5',
    description: 'Submit GWAS job',
  },
];

const GWASUIApp = (props) => {

  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [sourceId, setSourceId] = useState(4);
  const [cohortDefinitionId, setCohortDefinitionId] = useState(undefined);
  const [cohortDefinitions, setCohortDefinitions] = useState([]);
  const [allConcepts, setAllConcepts] = useState([])
  const [cohortConcepts, setCohortConcepts] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState(undefined);
  const [selectedConcepts, setSelectedConcepts] = useState([]);
  const [covariates, setCovariates] = useState([]);
  const [selectedOutcome, setSelectedOutcome] = useState([]);
  const [imputationScore, setImputationScore] = useState(undefined);
  const [mafThreshold, setMafThreshold] = useState(undefined);
  const [currentWorkflows, setCurrentWorkflow] = useState(["argo-wrapper-workflow-5536413310", "argo-wrapper-workflow-3238210855"]);
  const [gwasJobName, setGwasJobName] = useState("");

  const [numOfPC, setNumOfPC] = useState(3);
  const [selectedPhenotype, setSelectedPhenotype] = useState(undefined);
  const [selectedCovariates, setSelectedCovariates] = useState([]);
  const [jobName, setJobName] = useState("");
  const [showJobSubmissionResult, setShowJobSubmissionResult] = useState(false);
  const [jobSubmittedRunID, setJobSubmittedRunID] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  const onStep4FormSubmit = useCallback((values) => {
    // console.log('values', values);
  }, []);

  const onStep5FormSubmit = (values) => {
    setImputationScore(values.imputationCutoff);
    setMafThreshold(values.mafCutoff);
    setNumOfPC(values.numOfPC);
    // setJobName(values.GWASJobName);
    // setJobSubmittedRunID('run-12345');
    // setShowJobSubmissionResult(true);
  }

  const handleDelete = (key) => {
    const newlySelectedPhenotype = (selectedPhenotype.concept_id === key) ? undefined : selectedPhenotype;
    const newlySelectedCovariates = selectedCovariates.filter((item) => item.concept_id !== key);
    setSelectedConcepts(selectedConcepts.filter((item) => item.concept_id !== key));
    setSelectedPhenotype(newlySelectedPhenotype);
    setSelectedCovariates(newlySelectedCovariates);
    form.setFieldsValue({
      covariates: newlySelectedCovariates.map((val) => val.concept_name),
      outcome: newlySelectedPhenotype.concept_name,
    });
  };

  useEffect(() => {
    fetchAndSetCsrfToken().catch((err) => { console.log('error on csrf load - should still be ok', err); });
  }, [props]);

  async function getCohortDefinitions() {
    const cohortEndPoint = `${cohortMiddlewarePath}cohortdefinition-stats/by-source-id/${sourceId}`;
    const getCohortDefinitions = await fetch(cohortEndPoint);
    const data = await getCohortDefinitions.json();
    if (data) {
      // console.log('defs&stats', data.cohort_definitions_and_stats);
      setCohortDefinitions(data.cohort_definitions_and_stats);
    }
  }

  useEffect(() => {
    getCohortDefinitions();
  }, []);


  async function getConceptsBySource(cohortDefinitionId) {
    const conceptList = {
      "ConceptIds": [2000006886, 2000000280, 2000000895, 2000000914, 2000000900, 2000000846, 2000000324, 2000000872, 2000000873, 2000000874, 2000006885, 2000000708]
    };

    // 2000000323

    const sourceEndPoint = `${cohortMiddlewarePath}concept-stats/by-source-id/${sourceId}/by-cohort-definition-id/${cohortDefinitionId}`;
    fetch(sourceEndPoint,
      {
        method: "POST",
        credentials: "include",
        headers: headers,
        body: JSON.stringify(conceptList)
      }
    ).then(res => {
      return res.json();
    })
      .then(data => {
        if (data) {
          setAllConcepts(data.concepts);
          setCohortConcepts(data.concepts);
        }
      });
  }

  useEffect(() => {
    getConceptsBySource(cohortDefinitionId);
  }, [cohortDefinitionId]);


  const step1TableRowSelection = {
    type: 'radio',
    columnTitle: 'Select',
    selectedRowKeys: (selectedCohort) ? [selectedCohort.cohort_definition_id] : [],
    onChange: (_, selectedRows) => {
      setSelectedCohort(selectedRows[0]);
      setCohortDefinitionId(selectedRows[0].cohort_definition_id);
    },
    getCheckboxProps: (record) => ({
      disabled: record.size === 0
    })
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
      key: 'size'
    },
  ];

  const step2TableRowSelection = {
    type: 'checkbox',
    columnTitle: 'Select',
    selectedRowKeys: selectedConcepts.map((val) => val.concept_id),
    onChange: (_, selectedRows) => {
      setSelectedConcepts(selectedRows);
    },
  };

  const step2TableConfig = [
    {
      title: 'Concept ID',
      dataIndex: 'concept_id',
      key: 'concept_name'
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
      const newlySelectedCovariates = selectedConcepts.filter(((data) => data.concept_id !== selectedRows[0].concept_id));
      setSelectedPhenotype(selectedRows[0]);
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
        <span onClick={() => { console.log('record', record) }}>{`${(record.n_missing_ratio * 100).toFixed(0)}%`}</span>
      ),
    },
    // {
    //   title: selectedConcepts.length > 2 ? 'Action' : null,
    //   dataIndex: 'action',
    //   render: (_, record) => (
    //     (selectedConcepts.length > 2 && selectedPhenotype.concept_id !== record.concept_id) ? (
    //       <Popconfirm title='Remove this entry?' onConfirm={() => handleDelete(record.concept_id)}>
    //         <a>Remove</a>
    //       </Popconfirm>
    //     ) : null),
    // },
  ];

  const filterConcept = (term) => {
    setSearchTerm(term);
    const filteredConcepts = allConcepts.filter(entry => entry.concept_name.toLowerCase().includes(term.toLowerCase()) || entry.concept_id.toString().includes(term));
    filteredConcepts.length ? setCohortConcepts(filteredConcepts) : setCohortConcepts(cohortConcepts);
  }

  const handleCovariateDelete = (remainingCovariates) => {
    const filterCovList = (element) => remainingCovariates.some(item => item === element.concept_name);
    const newCovariates = selectedCovariates.filter(elem => filterCovList(elem));

    setSelectedCovariates(newCovariates);
    setSelectedConcepts([...selectedConcepts, selectedCovariates]);
    form.setFieldsValue({
      covariates: remainingCovariates
    });
  }

  const testSubmit = () => {
    const requestBody = {
      "n_pcs": numOfPC,
      "covariates": covariates,
      "out_prefix": Date.now().toString(),
      "outcome": selectedOutcome,
      "outcome_is_binary": true,
      "maf_threshold": Number(mafThreshold),
      "imputation_score_cutoff": Number(imputationScore),
      "template_version": "hello-world-template",
      "source_id": sourceId,
      "cohort_definition_id": cohortDefinitionId
    };
    // console.log('requestBody', requestBody);

    const newWorkflow = fetch(`${gwasWorkflowPath}submit`, {
      method: "POST",
      credentials: "include",
      headers: headers,
      body: JSON.stringify(requestBody)
    })
      .then((response) => {
        // console.log('response', response);
        return response.json();
      })
      .then(newWorkflow => {
        // console.log('newWorkflow', newWorkflow);
      });
    if (newWorkFlow) {
      // console.log('submitted', newWorkflow);
    }
  }

  const handleGwasSubmit = () => {
    setJobSubmittedRunID("5536413310");
    setShowJobSubmissionResult(true);
    setGwasJobName(currentWorkflows[0]);
    setJobName(gwasJobName);
  }

  const handleReset = () => {
    setCurrent(0);
    setSelectedConcepts([]);
    setSelectedPhenotype(undefined);
    setSelectedCovariates([]);
    setNumOfPC(3);
    setGwasJobName(undefined);
  }

  const generateContentForStep = (stepIndex) => {
    switch (stepIndex) {
      case 0: {
        return (
          <>
            <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
              <div className='GWASUI-mainTable'>
                <Table
                  className='GWASUI-table1'
                  rowKey='cohort_definition_id'
                  size='middle'
                  rowSelection={step1TableRowSelection}
                  columns={step1TableConfig}
                  dataSource={cohortDefinitions}
                />
              </div>
            </Space>
          </>


        );
      }
      case 1: {
        return (
          <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
            <h4 className="GWASUI-selectInstruction">The selection will be used for both covariates and phenotype selection</h4>
            <input className="GWASUI-searchInput" placeholder="Search by concept name or ID..." type="text" value={searchTerm} onChange={(e) => filterConcept(e.target.value)}></input>
            <div className='GWASUI-mainTable'>
              <Table
                className='GWASUI-table2'
                rowKey='concept_id'
                rowSelection={step2TableRowSelection}
                columns={step2TableConfig}
                dataSource={cohortConcepts}
              />
            </div>
          </Space>
        );
      }
      case 2: {
        return (
          <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
            <hr />
            <h4 className="GWASUI-selectInstruction">* Select Phenotype</h4>
            <div className='GWASUI-mainTable'>
              <Table
                className='GWASUI-table3'
                rowKey='concept_id'
                rowSelection={step3TableRowSelection}
                columns={step3TableConfig}
                dataSource={selectedConcepts}
              />
            </div>
          </Space>
        );
      }
      case 3: {
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
                  imputationCutoff: 0.3
                }}
                onFinish={() => onStep4FormSubmit()}
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
                    value={selectedCovariates}
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
                    style={{ width: '70%' }}
                  />
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
                  <InputNumber stringMode step="0.1" min={"0"} max={"1"} />
                </Form.Item>
                <Form.Item
                  label='Imputation Score Cutoff'
                  name='imputationCutoff'
                >
                  <InputNumber stringMode step="0.1" min={"0"} max={"1"} />
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

        if (showJobSubmissionResult) {
          return (
            <div className='GWASUI-mainArea'>
              <Result
                status={(jobSubmittedRunID) ? 'success' : 'error'}
                title={(jobSubmittedRunID) ? 'GWAS Job Submitted Successfully' : 'GWAS Job Submission Failed'}
                subTitle={`GWAS Job Name: ${jobName}, run ID: ${jobSubmittedRunID}`}
                extra={[
                  <Button
                    key='done'
                    onClick={() => {
                      handleReset()
                      // setSubmission(true);
                    }}
                  >
                    Done
                  </Button>,
                ]}
              />
            </div>
          );
        }

        return (
          <>
            <div className='GWASUI-mainArea'>
              <Form
                {...layout}
                name='control-hooks'
                form={form}
                onFinish={(values) => {
                  onStep5FormSubmit(values);
                }}
              >
                <Form.Item name='GWASJobName' label='GWAS Job Name' rules={[{ required: true, message: 'Please enter a name' }]}>
                  <Input placeholder='my_gwas_20201101_1' onChange={(e) => setGwasJobName(e.target.value)} />
                </Form.Item>
                <Form.Item {...tailLayout}>
                  <Button
                    htmlType='submit'
                    type='primary'
                    disabled={gwasJobName.length === 0}
                    onClick={() => {
                      handleGwasSubmit()
                    }}
                  >
                    Submit
                  </Button>
                  {/* <Button onClick={() => {
                    testSubmit()
                  }}>Test Submit</Button> */}
                </Form.Item>
              </Form>
            </div>
          </>
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
      <GWASWorkflowList currentWorkflows={currentWorkflows}></GWASWorkflowList>
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
          onClick={() => {
            setCurrent(current - 1);
          }}
        >
          Previous
        </Button>
        {current < steps.length - 1 && (
          <Button
            className='GWASUI-navBtn GWASUI-navBtn__next'
            type='primary'
            onClick={() => {
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
              if (current === 2) {
                setSelectedPhenotype(selectedConcepts[0]);
              }
              if (current === 3) {
                form.submit();
              }
              setCurrent(current + 1);
            }}
            disabled={!nextButtonEnabled}
          >
            Next
          </Button>
        )}
      </div>
    </Space>
  );
};

GWASUIApp.propTypes = {
  userAuthMapping: PropTypes.object.isRequired,
};

export default GWASUIApp;
