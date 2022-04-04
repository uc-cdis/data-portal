import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Steps, Button, Space, Table, Input, Modal, Collapse, List, Tag, Form, Result, Alert, Popconfirm, InputNumber, Select, Checkbox, Switch
} from 'antd';
import './GWASUIApp.css';
import { headers, fetchAndSetCsrfToken } from '../../configs';
import { gwasWorkflowPath, cohortMiddlewarePath } from '../../localconf';
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import { manifestObj, demoJobStatuses } from './utils';

const { Step } = Steps;

const { Panel } = Collapse;
const { TextArea } = Input;

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
  const [sourceId, setSourceId] = useState(2);
  const [cohortDefinitions, setCohortDefinitions] = useState([]);
  const [allConcepts, setAllConcepts] = useState([])
  const [cohortConcepts, setCohortConcepts] = useState([]);

  const [selectedCohort, setSelectedCohort] = useState(undefined);

  const [selectedConcepts, setSelectedConcepts] = useState([]);

  const [numOfPC, setNumOfPC] = useState(3);
  const [selectedPhenotype, setSelectedPhenotype] = useState(undefined);
  const [selectedCovariates, setSelectedCovariates] = useState([]);
  const [jobName, setJobName] = useState("mockedJobName");
  const [showJobSubmissionResult, setShowJobSubmissionResult] = useState(false);
  const [jobSubmittedRunID, setJobSubmittedRunID] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  const [submission, setSubmission] = useState(false);
  const [workflowName, setWorkflowName] = useState(undefined);

  const [gwasBody, setGwasBody] = useState({});
  const [showJobStatusModal, setShowJobStatusModal] = useState(false);
  const [jobStatusModalData, setJobStatusModalData] = useState({});


  const onStep3FormSubmit = useCallback((values) => {
    setGwasBody(values);
    setNumOfPC(values.numOfPC);
  }, []);

  const handleDelete = (key) => {
    const newlySelectedPhenotype = (selectedPhenotype.concept_id === key) ? undefined : selectedPhenotype;
    const newlySelectedCovariates = selectedCovariates.filter((item) => item.concept_id !== key);
    setSelectedConcepts(selectedConcepts.filter((item) => item.concept_id !== key));
    setSelectedPhenotype(newlySelectedPhenotype);
    setSelectedCovariates(newlySelectedCovariates);
    form.setFieldsValue({
      covariates: newlySelectedCovariates.map((val) => val.name),
      outcome: newlySelectedPhenotype.name,
    });
  };

  async function getCohortDefinitions() {
    const cohortEndPoint = `${cohortMiddlewarePath}cohortdefinition-stats/by-source-id/${sourceId}`;
    const getCohortDefinitions = await fetch(cohortEndPoint);
    const data = await getCohortDefinitions.json();
    if (data) {
      setCohortDefinitions(data.cohort_definitions_and_stats);
    }
  }

  useEffect(() => {
    getCohortDefinitions();
  }, [])

  async function getConceptsBySource(cohortDefinitionId) {
    const conceptList = {
      "ConceptIds": [2000006886, 2000000280, 2000000323, 2000000846, 2000000324, 2000000872, 2000000873, 2000000874, 2000006885, 2000000708]
    };

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

  const step1TableRowSelection = {
    type: 'radio',
    columnTitle: 'Select',
    selectedRowKeys: (selectedCohort) ? [selectedCohort.cohort_definition_id] : [],
    onChange: (_, selectedRows) => {
      setSelectedCohort(selectedRows[0]);
      getConceptsBySource(9); // or 10
    },
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
        <span>{`${(record.n_missing_ratio * 100).toFixed(0)}%`}</span>
      ),
    },
    {
      title: selectedConcepts.length > 2 ? 'Action' : null,
      dataIndex: 'action',
      render: (_, record) => (
        selectedConcepts.length > 2 ? (
          <Popconfirm title='Remove this entry?' onConfirm={() => handleDelete(record.concept_id)}>
            <a>Remove</a>
          </Popconfirm>
        ) : null),
    },
  ];

  useEffect(() => {
    fetchAndSetCsrfToken().catch((err) => { console.log('error on csrf load - should still be ok', err); });
  }, [props]);

  const filterConcept = (term) => {
    setSearchTerm(term);
    const filteredConcepts = allConcepts.filter(entry => entry.concept_name.toLowerCase().includes(term.toLowerCase()) || entry.concept_id.toString().includes(term));
    filteredConcepts.length ? setCohortConcepts(filteredConcepts) : setCohortConcepts(cohortConcepts);
  }

  const handleGwasSubmit = () => {
    setCurrent(0);
    setSelectedConcepts([]);
    setSelectedPhenotype(undefined);
    setSelectedCovariates([]);
    setNumOfPC(3);
    setJobName(undefined);
    // setShowJobSubmissionResult(true);
    // setJobSubmittedRunID("newGwasJob");

    // const requestBody = {
    //   "n_pcs": gwasBody.numOfPC,
    //   "covariates": gwasBody.covariates,
    //   "out_prefix": "genesis_vadc",
    //   "outcome": selectedPhenotype,
    //   "outcome_is_binary": "TRUE",
    //   "maf_threshold": gwasBody.mafCutoff,
    //   "imputation_score_cutoff": gwasBody.imputationCutoff,
    //   "template_version": "hello-world-1.0",
    //   "gen3_user_name": "Craig.Teerlink@va.gov"
    // };
    const requestBody = {
      "n_pcs": 5,
      "covariantes": "test_cov",
      "out_prefix": "test_out_prefix",
      "outcome": "test_outcome",
      "outcome_is_binary": "TRUE",
      "maf_threshold": 1.01,
      "imputation_score_cutoff": 2.02,
      "template_version": "hello-world-1.0"
    };

    fetch(`${gwasWorkflowPath}submit`, {
      method: "POST",
      credentials: "include",
      headers: headers,
      body: JSON.stringify(requestBody)
    })
      .then((response) => {
        return response.json()
      })
      .then(newWorkflow => {
        // console.log('newWorkflow', newWorkflow);
      });
  }

  const handleJobStatusModalShow = (runID, displayFullLog = true) => {
    // TODO Fetch GWAS status endpoint
    // fetch(`${gwasWorkflow}status)
    setJobStatusModalData(JSON.stringify(manifestObj));
    setShowJobStatusModal(true);
  };


  const getStatusTag = (jobStatus) => {
    if (!jobStatus) {
      return (
        <Tag icon={<QuestionCircleOutlined />} color='default'>
          Unknown
        </Tag>
      );
    }
    switch (jobStatus) {
      case 'running':
        return (
          <Tag icon={<SyncOutlined spin />} color='processing'>
            In Progress
          </Tag>
        );
      case 'completed':
        return (
          <Tag icon={<CheckCircleOutlined />} color='success'>
            Completed
          </Tag>
        );
      case 'failed':
        return (
          <Tag icon={<CloseCircleOutlined />} color='error'>
            Failed
          </Tag>
        );
      case 'cancelled':
        return (
          <Tag icon={<MinusCircleOutlined />} color='warning'>
            Cancelled
          </Tag>
        );
      default:
        return (
          <Tag icon={<QuestionCircleOutlined />} color='default'>
            Unknown
          </Tag>
        );
    }
  }

  const cancelGwasJob = (jobId) => {
    // TODO Fetch GWAS cancel endpoint
    // fetch(`${gwasWorkflow}cancel)
    setShowJobStatusModal(false);
  }

  const getActionButtons = (listItem) => {
    console.log(listItem);
    // <Button type='link' size='small' onClick={(event) => {
    //   event.stopPropagation();
    //   handleJobStatusModalShow(listItem.runID);
    // }}>show logs</Button>
    const actionButtons = [];
    if (listItem.status === 'running') {
    actionButtons.unshift(
      <Popconfirm
        title='Are you sure you want to cancel this job?'
        onConfirm={(event) => {
          event.stopPropagation();
          cancelGwasJob("123");
        }}
        okText='Yes'
        cancelText='No'
      >
        <Button type='link' size='small' danger>cancel job</Button>
      </Popconfirm>);
    }
    if (listItem.status === 'completed') {
      actionButtons.unshift(
        <Button
          primary
          type='link'
          size='small'
          onClick={(event) => {
            event.stopPropagation();
            handleJobStatusModalShow(listItem.runID, false);
          }}
        >
          show output
        </Button>);
    }
    return actionButtons;
  }

  const handleJobStatusModalCancel = () => {
    setShowJobStatusModal(false);
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
            <div className="GWAS-headingContainer"><h4 className="GWAS-leftHeading">* Select Phenotype</h4><h4 className="GWAS-rightHeading">* Select Covariates to Remove</h4></div>
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
                onFinish={onStep3FormSubmit}
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
                    disabled
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
                  <InputNumber disabled stringMode step="0.1" min={"0"} max={"1"} />
                </Form.Item>
                <Form.Item
                  label='Imputation Score Cutoff'
                  name='imputationCutoff'
                >
                  <InputNumber disabled stringMode step="0.1" min={"0"} max={"1"} />
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
                      handleGwasSubmit()
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
          {/* <div className='GWASApp-jobStatus'>
            <Collapse onClick={(event) => event.stopPropagation()}>
              <Panel header='Submitted Job Statuses' key='1'>
                <List
                  className='GWASApp__jobStatusList'
                  itemLayout='horizontal'
                  pagination={{ pageSize: 5 }}
                  dataSource={'running'}
                  renderItem={(item) => (
                    <List.Item
                      actions={getActionButtons(item)}
                    >
                      <List.Item.Meta
                        title={`Run ID: ${item.runID}`}
                        description={(item.jobName) ? `GWAS Job Name: ${item.jobName}` : null}
                      />
                      <Button>Output</Button>
                      <span>&nbsp;</span>
                      <div>{getStatusTag('running')}</div>

                    </List.Item>

                  )}
                />

              </Panel>
            </Collapse>
            <Modal
              visible={showJobStatusModal}
              closable={false}
              title={'Show job logs'}
              footer={[
                <div className="GWAS-btnContainer">
                  <Button key='copy' className="g3-button g3-button--tertiary">
                    Copy JSON
                  </Button>
                  <Button key='download' className="explorer-button-group__download-button g3-button g3-button--primary">
                    <i className="g3-icon g3-icon--sm g3-icon--datafile g3-button__icon g3-button__icon--left"></i>
                    Download Manifest
                    <i className="g3-icon g3-icon--sm g3-icon--download g3-button__icon g3-button__icon--right"></i>
                  </Button>
                  <Button className="g3-button g3-button--secondary" key='close' onClick={() => handleJobStatusModalCancel()}>
                    Close
                  </Button>
                </div>,
              ]}
            >
              <TextArea rows={10} value={jobStatusModalData} readOnly />

            </Modal>
          </div> */}
            <div className='GWASUI-mainArea'>
              <Form
                {...layout}
                name='control-hooks'
                onFinish={(values) => {
                  console.log(values);
                  // setJobName(values.GWASJobName);
                  // setJobSubmittedRunID('run-12345');
                  // setShowJobSubmissionResult(true);
                }}
              >
                <Form.Item name='GWASJobName' label='GWAS Job Name' rules={[{ required: true, message: 'Please enter a name for GWAS job!' }]}>
                  <Input placeholder='my_gwas_20201101_1' />
                </Form.Item>
                <Form.Item {...tailLayout}>
                  <Button
                    htmlType='submit'
                    type='primary'
                    onClick={() => {
                      setJobName('vadc-gwas-cwr7h');
                      setJobSubmittedRunID('run-12345');
                      setShowJobSubmissionResult(true);
                    }}
                  >
                    Submit
                  </Button>
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
       <div className='GWASApp-jobStatus'>
            <Collapse onClick={(event) => event.stopPropagation()}>
              <Panel header='Submitted Job Statuses' key='1'>
                <List
                  className='GWASApp__jobStatusList'
                  itemLayout='horizontal'
                  pagination={{ pageSize: 5 }}
                  dataSource={demoJobStatuses}
                  renderItem={(item) => (
                    <List.Item
                      actions={getActionButtons(item)}
                    >
                      <List.Item.Meta
                        title={`Run ID: ${item.runID}`}
                        description={(item.jobName) ? `GWAS Job Name: ${item.jobName}` : null}
                      />
                      {/* <Button>Output</Button> */}
                      <span>&nbsp;</span>
                      <div>{getStatusTag(item.status)}</div>

                    </List.Item>

                  )}
                />

              </Panel>
            </Collapse>
            <Modal
              visible={showJobStatusModal}
              closable={false}
              title={'Show job logs'}
              footer={[
                <div className="GWAS-btnContainer">
                  <Button key='copy' className="g3-button g3-button--tertiary">
                    Copy JSON
                  </Button>
                  <Button key='download' className="explorer-button-group__download-button g3-button g3-button--primary">
                    <i className="g3-icon g3-icon--sm g3-icon--datafile g3-button__icon g3-button__icon--left"></i>
                    Download Manifest
                    <i className="g3-icon g3-icon--sm g3-icon--download g3-button__icon g3-button__icon--right"></i>
                  </Button>
                  <Button className="g3-button g3-button--secondary" key='close' onClick={() => handleJobStatusModalCancel()}>
                    Close
                  </Button>
                </div>,
              ]}
            >
              <TextArea rows={10} value={jobStatusModalData} readOnly />

            </Modal>
          </div>
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
          className='GWASUI-navBtn'
          // style={{ margin: '0 16px' }}
          onClick={() => {
            setCurrent(current - 1);
          }}
        >
          Previous
        </Button>
        {current < steps.length - 1 && (
          <Button
            className='GWASUI-navBtn GWASUI-navBtn__next'
            // style={{ margin: '0 16px' }}
            type='primary'
            onClick={() => {
              if (current === 1) {
                setSelectedPhenotype(selectedConcepts[0]);
                setSelectedCovariates([...selectedConcepts].slice(1));
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
