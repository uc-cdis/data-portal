import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Steps, Button, Space, Table, Input, Form, Result, Alert, Popconfirm, InputNumber, Select,
} from 'antd';
import { userHasMethodForServiceOnResource } from '../../authMappingUtils';
import { mockCohortData, mockConceptData } from './utils.js';
// import GWASUIJobStatusList from './GWASUIJobStatusList';
import './GWASUI.css';

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

const GWASUI = (props) => {
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [selectedCohort, setSelectedCohort] = useState(undefined);
  const [selectedConcepts, setSelectedConcepts] = useState([]);
  const [numOfPC, setNumOfPC] = useState(3);
  const [selectedPhenotype, setSelectedPhenotype] = useState(undefined);
  const [selectedCovariates, setSelectedCovariates] = useState([]);
  const [jobName, setJobName] = useState(undefined);
  const [showJobSubmissionResult, setShowJobSubmissionResult] = useState(false);
  const [jobSubmittedRunID, setJobSubmittedRunID] = useState(undefined);

  const onStep3FormSubmit = useCallback((values) => {
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

  const step1TableRowSelection = {
    type: 'radio',
    columnTitle: 'Select',
    selectedRowKeys: (selectedCohort) ? [selectedCohort.cohort_id] : [],
    onChange: (_, selectedRows) => {
      setSelectedCohort(selectedRows[0]);
    },
  };

  const step1TableConfig = [
    {
      title: 'Cohort ID',
      dataIndex: 'cohort_id',
      key: 'cohortID',
    },
    {
      title: 'Cohort Name',
      dataIndex: 'cohort_name',
      key: 'cohortName',
    },
    {
      title: 'Cohort Size',
      dataIndex: 'size',
      key: 'size',
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
      key: 'conceptID',
      filterSearch: true,
    },
    {
      title: 'Concept Name',
      dataIndex: 'name',
      key: 'conceptName',
      filterSearch: true,
    },
    {
      title: 'Domain',
      dataIndex: 'domain',
      key: 'domain',
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
        covariates: newlySelectedCovariates.map((val) => val.name),
        outcome: selectedRows[0].name,
      });
    },
  };

  const step3TableConfig = [
    {
      title: 'Concept ID',
      dataIndex: 'concept_id',
      key: 'conceptID',
    },
    {
      title: 'Concept Name',
      dataIndex: 'name',
      key: 'conceptName',
    },
    {
      title: 'Domain',
      dataIndex: 'domain',
      key: 'domain',
    },
    {
      title: 'Missing',
      dataIndex: 'n_missing',
      key: 'missing',
      render: (_, record) => (
        <span>{`${record.n_missing} / ${record.cohort_size} (${(record.n_missing_ratio * 100).toFixed(0)}%)`}</span>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => (
        selectedConcepts.length > 2 ? (
          <Popconfirm title='Remove this entry?' onConfirm={() => handleDelete(record.concept_id)}>
            <a>Remove</a>
          </Popconfirm>
        ) : null),
    },
  ];

  const userHasMariner = () => userHasMethodForServiceOnResource('access', 'mariner', '/mariner', props.userAuthMapping);

  const generateContentForStep = (stepIndex) => {
    switch (stepIndex) {
    case 0: {
      return (
        <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
          <div className='GWASUI-mainTable'>
            <Table
              className='GWASUI-table1'
              rowKey='cohort_id'
              rowSelection={step1TableRowSelection}
              columns={step1TableConfig}
              dataSource={mockCohortData}
            />
          </div>
        </Space>
      );
    }
    case 1: {
      return (
        <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
          <div className='GWASUI-mainTable'>
            <Table
              className='GWASUI-table2'
              rowKey='concept_id'
              rowSelection={step2TableRowSelection}
              columns={step2TableConfig}
              dataSource={mockConceptData}
            />
          </div>
        </Space>
      );
    }
    case 2: {
      const processedStep3Data = selectedConcepts.map((md) => ({
        ...md,
        cohort_size: selectedCohort.size,
        n_missing: Math.round(selectedCohort.size * md.n_missing_ratio),
      }));
      return (
        <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
          <div className='GWASUI-mainTable'>
            <Table
              className='GWASUI-table3'
              rowKey='concept_id'
              rowSelection={step3TableRowSelection}
              columns={step3TableConfig}
              dataSource={processedStep3Data}
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
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item
                label='Outcome'
                name='outcome'
              >
                <Input
                  disabled
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item
                label='Is Binary Outcome?'
                name='isBinary'
              >
                <Input
                  disabled
                  style={{ width: '100%' }}
                />
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
      console.log('PCs: ', numOfPC);
      console.log('Cohort: ', selectedCohort);
      console.log('Phenotype: ', selectedPhenotype);
      console.log('Covariates: ', selectedCovariates);

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
                    setCurrent(0);
                    setSelectedCohort(undefined);
                    setSelectedConcepts([]);
                    setSelectedPhenotype(undefined);
                    setSelectedCovariates([]);
                    setNumOfPC(3);
                    setJobName(undefined);
                    setShowJobSubmissionResult(false);
                    setJobSubmittedRunID(undefined);
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
        <div className='GWASUI-mainArea'>
          <Form
            {...layout}
            name='control-hooks'
            onFinish={(values) => {
              setJobName(values.GWASJobName);
              setJobSubmittedRunID('run-12345');
              setShowJobSubmissionResult(true);
            }}
          >
            <Form.Item name='GWASJobName' label='GWAS Job Name' rules={[{ required: true, message: 'Please enter a name for GWAS job!' }]}>
              <Input placeholder='my_gwas_20201101_1' />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button
                htmlType='submit'
                type='primary'
                disabled={!userHasMariner()}
              >
              Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
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
    nextButtonEnabled = !!selectedPhenotype;
  }

  return (
    <Space direction={'vertical'} style={{ width: '100%' }}>
      {(!userHasMariner())
        ? (
          <Alert
            message='Warning: You don&apos;t have required permission to submit GWAS job'
            banner
          />
        )
        : null}
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} description={item.description} />
        ))}
      </Steps>
      <div className='steps-content'>
        <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
          {generateContentForStep(current)}
          {(selectedCohort && !showJobSubmissionResult) && <h4 className='GWASUI-selectedCohort'>{`Selected Cohort: ${selectedCohort.cohort_name}`}</h4>}
        </Space>
      </div>
      <div className='steps-action'>
        {current > 0 && !showJobSubmissionResult && (
          <Button
            className='GWASUI-navBtn'
            style={{ margin: '0 8px' }}
            onClick={() => {
              setCurrent(current - 1);
            }}
          >
              Previous
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button
            className='GWASUI-navBtn GWASUI-navBtn__next'
            type='primary'
            onClick={() => {
              if (current === 1) {
                setSelectedPhenotype(selectedConcepts[0]);
                setSelectedCovariates([...selectedConcepts].slice(1));
                form.setFieldsValue({
                  covariates: [...selectedConcepts].slice(1).map((val) => val.name),
                  outcome: selectedConcepts[0].name,
                });
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

GWASUI.propTypes = {
  userAuthMapping: PropTypes.object.isRequired,
};

export default GWASUI;
