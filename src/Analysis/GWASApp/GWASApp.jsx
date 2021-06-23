import React from 'react';
import PropTypes from 'prop-types';
import {
  Steps, Button, Space, Table, Modal, Typography, Checkbox, Radio, Divider, Select, Input, Form, Result, Spin, InputNumber, Alert,
} from 'antd';
import { humanFileSize } from '../../utils.js';
import { fetchWithCreds } from '../../actions';
import { userHasMethodForServiceOnResource } from '../../authMappingUtils';
import { marinerUrl } from '../../localconf';
import marinerRequestBody from './utils.js';
import GWASAppJobStatusList from './GWASAppJobStatusList';
import './GWASApp.css';

const { Step } = Steps;
const { Text } = Typography;

const MAX_PREVIEW_FILE_SIZE_BYTES = 1000000;
const steps = [
  {
    title: 'Upload Phenotype and Covariate File',
  },
  {
    title: 'Specify Phenotype and Covariate',
  },
  {
    title: 'Parameter Settings',
  },
  {
    title: 'Job Submission',
  },
];

class GWASApp extends React.Component {
  mainTableRowSelection = {
    type: 'radio',
    onChange: (_, selectedRows) => {
      this.setState({
        selectedDataKey: selectedRows[0].WorkspaceKey,
      });
    },
    getCheckboxProps: (record) => ({
      disabled: !(record.SizeBytes && record.SizeBytes <= MAX_PREVIEW_FILE_SIZE_BYTES),
    }),
  };

  mainTableConfig = [
    {
      title: 'File Name',
      dataIndex: 'WorkspaceKey',
      key: 'WorkspaceKey',
    },
    {
      title: 'File Size',
      dataIndex: 'SizeBytes',
      key: 'SizeBytes',
      render: (text) => humanFileSize(text),
    },
    {
      title: 'Last Modified Date',
      dataIndex: 'LastModified',
      key: 'LastModified',
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => {
        if (record.SizeBytes && record.SizeBytes <= MAX_PREVIEW_FILE_SIZE_BYTES) {
          return (
            <Space size='small'>
              <Button
                size='small'
                type='link'
                onClick={() => {
                  if (record.WorkspaceKey !== this.state.previewModalDataKey) {
                    this.props.onLoadWorkspaceStorageFile(record.WorkspaceKey);
                  }
                  this.setState({
                    showPreviewModal: true,
                    previewModalDataKey: record.WorkspaceKey,
                  });
                }}
              >
          Preview
              </Button>
            </Space>
          );
        }
        return null;
      },
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      showStep0Table: false,
      showPreviewModal: false,
      previewModalDataKey: undefined,
      selectedDataKey: undefined,
      jobName: undefined,
      showJobSubmissionResult: false,
      jobSubmittedRunID: undefined,
      enableStep2NextButton: true,
      step2ConfigValues: {
        workflow: 'demo',
        genotype_cutoff: 0.2,
        sample_cutoff: 0.04,
        maf_cutoff: 0.05,
      },
    };
  }

  componentDidMount() {
    this.props.onLoadWorkspaceStorageFileList();
    this.props.onLoadMarinerJobStatus();
    this.intervalId = setInterval(() => {
      this.props.onLoadMarinerJobStatus();
    }, 15000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  handlePreviewModalCancel = () => {
    this.setState({
      showPreviewModal: false,
    });
  };

  userHasMariner = () => userHasMethodForServiceOnResource('access', 'mariner', '/mariner', this.props.userAuthMapping)

  generateContentForStep = (stepIndex) => {
    switch (stepIndex) {
    case 0: {
      if (this.props.wssListFileError) {
        return (
          <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
            <Result
              status='warning'
              title={this.props.wssListFileError}
            />
          </Space>
        );
      }
      let modalTableColumnConfig;
      if (this.props.wssFileData
        && this.props.wssFileData.fileData
        && this.props.wssFileData.fileData.length > 0) {
        modalTableColumnConfig = Object.keys(this.props.wssFileData.fileData[0]).filter((element) => element !== 'key').map((key) => ({
          title: key,
          dataIndex: key,
          key,
        }));
      }
      if (!this.props.wssFileObjects) {
        return (
          <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
            <Spin size='large' tip='Loading data from workspace storage...' />
          </Space>
        );
      }
      return (
        <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
          <Button
            onClick={() => { this.setState({ showStep0Table: true }); }}
            disabled={this.state.showStep0Table}
          >
            Select File
          </Button>
          <Text type='secondary'>(The phenotype and covariants with the genotype file will be matched using the IID column)</Text>
          {(this.state.showStep0Table)
            ? (
              <div className='GWASApp-mainTable'>
                <Table
                  rowSelection={this.mainTableRowSelection}
                  columns={this.mainTableConfig}
                  dataSource={this.props.wssFileObjects}
                />
              </div>
            )
            : null}
          <Modal
            visible={this.state.showPreviewModal}
            closable={false}
            title={`Preview File Content: ${this.state.previewModalDataKey}`}
            footer={[
              <Button key='close' onClick={this.handlePreviewModalCancel}>
              Close
              </Button>,
            ]}
          >
            {(modalTableColumnConfig)
              ? <Table size={'small'} columns={modalTableColumnConfig} dataSource={this.props.wssFileData.fileData} />
              : (
                <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
                  <Spin size='large' tip='Loading data from workspace storage...' />
                </Space>
              )}
          </Modal>
        </Space>
      );
    }
    case 1: {
      let specifyDataCols;
      if (this.props.wssFileData
        && this.props.wssFileData.workspaceKey === this.state.selectedDataKey
        && this.props.wssFileData.fileData
        && this.props.wssFileData.fileData.length > 0) {
        specifyDataCols = Object.keys(this.props.wssFileData.fileData[0])
          .filter((element) => element !== 'IID' && element !== '#FID' && element !== 'key')
          .map((colKey) => colKey);
      } else {
        return (
          <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
            <Spin size='large' tip='Loading data from workspace storage...' />
          </Space>
        );
      }
      return (
        <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
          {(specifyDataCols)
            ? (
              <div className='GWASApp-specifyTable'>
                <Space className='GWASApp-specifyTable__innerSpace'>
                  <Space direction={'vertical'}>
                    <Text strong>Existing Clinical Variables</Text>
                    <Checkbox.Group defaultValue={['gender', 'age']}>
                      <Space direction={'vertical'}>
                        <Checkbox key='gender' value='gender'>Gender</Checkbox>
                        <Checkbox key='age' value='age'>Age</Checkbox>
                      </Space>
                    </Checkbox.Group>
                  </Space>
                  <Divider type='vertical' />
                  <Space direction={'vertical'}>
                    <Text strong>Genotype PCs</Text>
                    <Checkbox.Group defaultValue={['pc1', 'pc2']}>
                      <Space direction={'vertical'}>
                        <Checkbox key='pc1' value='pc1'>PC1</Checkbox>
                        <Checkbox key='pc2' value='pc2'>PC2</Checkbox>
                        <Checkbox key='pc3' value='pc3'>PC3</Checkbox>
                        <Checkbox key='pc4' value='pc4'>PC4</Checkbox>
                        <Checkbox key='pc5' value='pc5'>PC5</Checkbox>
                      </Space>
                    </Checkbox.Group>
                  </Space>
                  <Divider type='vertical' />
                  <Space direction={'vertical'}>
                    <Text strong>Uploaded Clinical Variables</Text>
                    <Checkbox.Group defaultValue={specifyDataCols}>
                      <Space direction={'vertical'}>
                        {specifyDataCols.map((col) => <Checkbox key={col} value={col}>{col}</Checkbox>)}
                      </Space>
                    </Checkbox.Group>
                  </Space>
                  <Divider type='vertical' />
                  <Space direction={'vertical'}>
                    <Text strong>Phenotype</Text>
                    <Radio.Group defaultValue={specifyDataCols[0]}>
                      <Space direction={'vertical'}>
                        {specifyDataCols.map((col) => <Radio key={col} value={col}>{col}</Radio>)}
                      </Space>
                    </Radio.Group>
                  </Space>
                </Space>
              </div>
            )
            : null}
        </Space>
      );
    }
    case 2: {
      return (
        <div className='GWASApp-mainArea'>
          <Form
            layout='vertical'
            initialValues={{
              ...this.state.step2ConfigValues,
            }}
            onFieldsChange={(_, allFields) => {
              if (allFields.some((field) => !field.validating && field.errors.length > 0)) {
                this.setState({ enableStep2NextButton: false });
              } else if (allFields.every((field) => !field.validating && field.errors.length === 0)) {
                const step2ConfigValues = {};
                allFields.forEach((field) => {
                  step2ConfigValues[field.name[0]] = field.value;
                });
                this.setState({
                  enableStep2NextButton: true,
                  step2ConfigValues,
                });
              }
            }}
          >
            <Space className='GWASApp-specifyTable__innerSpace' split={<Divider type='vertical' />}>
              <Form.Item
                className='GWASApp-specifyTable__formItem'
                label={<Text strong>Workflow</Text>}
                name='workflow'
              >
                <Select>
                  <Select.Option value='demo'>Demo</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                className='GWASApp-specifyTable__formItem'
                label={<Text strong>Genotype Cutoff</Text>}
                name='genotype_cutoff'
                rules={[
                  () => ({
                    validator(_, value) {
                      if (value && value <= 1 && value >= 0) {
                        return Promise.resolve();
                      }
                      return Promise.reject('Must be a numeric value between 0 and 1');
                    },
                  }),
                ]}
              >
                <InputNumber min={0} max={1} step={0.01} />
              </Form.Item>
              <Form.Item
                className='GWASApp-specifyTable__formItem'
                label={<Text strong>Sample Cutoff</Text>}
                name='sample_cutoff'
                rules={[
                  () => ({
                    validator(_, value) {
                      if (value && value <= 1 && value >= 0) {
                        return Promise.resolve();
                      }
                      return Promise.reject('Must be a numeric value between 0 and 1');
                    },
                  }),
                ]}
              >
                <InputNumber min={0} max={1} step={0.01} />
              </Form.Item>
              <Form.Item
                className='GWASApp-specifyTable__formItem'
                label={<Text strong>MAF Cutoff</Text>}
                name='maf_cutoff'
                rules={[
                  () => ({
                    validator(_, value) {
                      if (value && value <= 1 && value >= 0) {
                        return Promise.resolve();
                      }
                      return Promise.reject('Must be a numeric value between 0 and 1');
                    },
                  }),
                ]}
              >
                <InputNumber min={0} max={1} step={0.01} />
              </Form.Item>
            </Space>
          </Form>
        </div>
      );
    }
    case 3: {
      const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
      };
      const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
      };

      if (this.state.showJobSubmissionResult) {
        return (
          <div className='GWASApp-mainArea'>
            <Result
              status={(this.state.jobSubmittedRunID) ? 'success' : 'error'}
              title={(this.state.jobSubmittedRunID) ? 'GWAS Job Submitted Successfully' : 'GWAS Job Submission Failed'}
              subTitle={`GWAS Job Name: ${this.state.jobName}, run ID: ${this.state.jobSubmittedRunID}`}
              extra={[
                <Button
                  key='done'
                  onClick={() => {
                    this.setState({
                      current: 0,
                      showStep0Table: false,
                      showPreviewModal: false,
                      previewModalDataKey: undefined,
                      selectedDataKey: undefined,
                      jobName: undefined,
                      showJobSubmissionResult: false,
                      jobSubmittedRunID: undefined,
                      enableStep2NextButton: true,
                      step2ConfigValues: {
                        workflow: 'demo',
                        genotype_cutoff: 0.2,
                        sample_cutoff: 0.04,
                        maf_cutoff: 0.05,
                      },
                    });
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
        <div className='GWASApp-mainArea'>
          <Form
            {...layout}
            name='control-hooks'
            onFinish={(values) => {
              const requestBody = marinerRequestBody[this.state.step2ConfigValues.workflow];
              Object.keys(this.state.step2ConfigValues)
                .filter((cfgKey) => cfgKey !== 'workflow')
                .forEach((cfgKey) => {
                  requestBody.input[cfgKey] = this.state.step2ConfigValues[cfgKey].toString();
                  return null;
                });
              requestBody.input.phenotype_file.location = `USER/${this.state.selectedDataKey}`;
              if (!requestBody.tags) {
                requestBody.tags = {};
              }
              requestBody.tags.jobName = values.GWASJobName;
              fetchWithCreds({
                path: `${marinerUrl}`,
                method: 'POST',
                body: JSON.stringify(requestBody),
              })
                .then(({ data }) => {
                  if (data && data.runID) {
                    this.getMarinerJobStatus();
                    this.setState({
                      jobName: values.GWASJobName,
                      jobSubmittedRunID: data.runID,
                      showJobSubmissionResult: true,
                    });
                  } else {
                    this.setState({
                      jobName: values.GWASJobName,
                      jobSubmittedRunID: undefined,
                      showJobSubmissionResult: true,
                    });
                  }
                });
            }}
          >
            <Form.Item name='GWASJobName' label='GWAS Job Name' rules={[{ required: true, message: 'Please enter a name for GWAS job!' }]}>
              <Input placeholder='my_gwas_20201101_1' />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button
                htmlType='submit'
                type='primary'
                disabled={!this.userHasMariner()}
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
  }

  next() {
    this.setState((prevState) => {
      const current = prevState.current + 1;
      if (current === 1) {
        if (!this.props.wssFileData
        || this.props.wssFileData.workspaceKey !== prevState.selectedDataKey) {
          this.props.onLoadWorkspaceStorageFile(prevState.selectedDataKey);
        }
      }
      return {
        current,
        showPreviewModal: (current === 0),
        showStep0Table: (current === 0),
      };
    });
  }

  prev() {
    this.setState((prevState) => {
      const current = prevState.current - 1;
      const selectedDataKey = (current === 0) ? undefined : prevState.selectedDataKey;
      return {
        current,
        selectedDataKey,
      };
    });
  }

  render() {
    const { current } = this.state;
    let nextButtonEnabled = true;
    if (current === 0 && !this.state.selectedDataKey) {
      nextButtonEnabled = false;
    } else if (current === 1 && !(this.props.wssFileData
      && this.props.wssFileData.fileData
      && this.props.wssFileData.fileData.length > 0)) {
      nextButtonEnabled = false;
    } else if (current === 2) {
      nextButtonEnabled = this.state.enableStep2NextButton;
    }

    return (
      <Space direction={'vertical'} style={{ width: '100%' }}>
        {(!this.userHasMariner())
          ? (
            <Alert
              message='Warning: You don&apos;t have required permission to submit GWAS job'
              banner
            />
          )
          : null}
        {(this.props.marinerJobStatus.length > 0)
          ? (
            <GWASAppJobStatusList
              marinerJobStatus={this.props.marinerJobStatus}
              getMarinerJobStatusFuncCallback={() => this.props.onLoadMarinerJobStatus()}
            />
          )
          : null}
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className='steps-content'>{this.generateContentForStep(current)}</div>
        <div className='steps-action'>
          {current > 0 && !this.state.showJobSubmissionResult && (
            <Button className='GWASApp-navBtn' style={{ margin: '0 8px' }} onClick={() => this.prev()}>
              Previous
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button
              className='GWASApp-navBtn GWASApp-navBtn__next'
              type='primary'
              onClick={() => this.next()}
              disabled={!nextButtonEnabled}
            >
              Next
            </Button>
          )}
        </div>
      </Space>
    );
  }
}

GWASApp.propTypes = {
  wssFileObjects: PropTypes.array,
  wssFilePrefix: PropTypes.string,
  wssListFileError: PropTypes.string,
  wssFileData: PropTypes.shape({
    workspaceKey: PropTypes.string.isRequired,
    fileData: PropTypes.array,
  }),
  marinerJobStatus: PropTypes.array,
  onLoadWorkspaceStorageFileList: PropTypes.func.isRequired,
  onLoadWorkspaceStorageFile: PropTypes.func.isRequired,
  onLoadMarinerJobStatus: PropTypes.func.isRequired,
  userAuthMapping: PropTypes.object.isRequired,
};

GWASApp.defaultProps = {
  wssFileObjects: undefined,
  wssFilePrefix: undefined,
  wssFileData: undefined,
  wssListFileError: undefined,
  marinerJobStatus: [],
};

export default GWASApp;
