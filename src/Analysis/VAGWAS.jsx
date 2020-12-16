import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Steps, Button, Space, Table, Modal, Typography, Checkbox, Radio, Divider, Select, Input, Form, Result, Spin, InputNumber } from 'antd';
import { humanFileSize } from '../utils.js';
import './VAGWAS.css';

const { Step } = Steps;
const { Text } = Typography;

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

class VAGWAS extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      showStep0Table: false,
      showPreviewModal: false,
      previewModalDataKey: undefined,
      selectedDataKey: undefined,
      jobName: undefined,
      jobSubmitted: false,
      enableStep2NextButton: false,
    };
  }

  componentDidMount() {
    this.props.onLoadWorkspaceStorageFileList();
  }

  mainTableRowSelection = {
    type: 'radio',
    onChange: (_, selectedRows) => {
      this.setState({
        selectedDataKey: selectedRows[0].WorkspaceKey,
      });
    },
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
      render: text => humanFileSize(text),
    },
    {
      title: 'Last Modified Date',
      dataIndex: 'LastModified',
      key: 'LastModified',
    },
    {
      title: 'Action',
      key: 'action',
      render: record => (<Space size='small'>
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
      ),
    },
  ];

  handlePreviewModalCancel = () => {
    this.setState({
      showPreviewModal: false,
    });
  };

  next() {
    const current = this.state.current + 1;
    if (current === 1) {
      if (!this.props.wssFileData
        || this.props.wssFileData.workspaceKey !== this.state.selectedDataKey) {
        this.props.onLoadWorkspaceStorageFile(this.state.selectedDataKey);
      }
    }
    this.setState({
      current,
      showPreviewModal: (current === 0),
      showStep0Table: (current === 0),
    });
  }

  prev() {
    const current = this.state.current - 1;
    const selectedDataKey = (current === 0) ? undefined : this.state.selectedDataKey;
    this.setState({
      current,
      selectedDataKey,
    });
  }

  generateContentForStep = (stepIndex, form) => {
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
        modalTableColumnConfig = Object.keys(this.props.wssFileData.fileData[0]).filter(element => element !== 'key').map(key => ({
          title: key,
          dataIndex: key,
          key,
        }));
      }
      if (!this.props.wssFileObjects) {
        return (
          <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
            <Spin size='large' tip='Loading data from workspace storage...' />
          </Space>);
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
          {(this.state.showStep0Table) ?
            <div className='vaGWAS__mainTable'>
              <Table
                rowSelection={this.mainTableRowSelection}
                columns={this.mainTableConfig}
                dataSource={this.props.wssFileObjects}
              />
            </div>
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
            {(modalTableColumnConfig) ?
              <Table size={'small'} columns={modalTableColumnConfig} dataSource={this.props.wssFileData.fileData} /> :
              (<Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
                <Spin size='large' tip='Loading data from workspace storage...' />
              </Space>)}
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
          .filter(element => element !== 'IID' && element !== 'FID' && element !== 'key')
          .map(colKey => colKey);
      } else {
        return (
          <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
            <Spin size='large' tip='Loading data from workspace storage...' />
          </Space>);
      }
      return (
        <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
          {(specifyDataCols) ?
            <div className='vaGWAS__step1-specifyTable'>
              <Space className='vaGWAS__step1-specifyTable_innerSpace'>
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
                      {specifyDataCols.map(col => <Checkbox key={col} value={col}>{col}</Checkbox>)}
                    </Space>
                  </Checkbox.Group>
                </Space>
                <Divider type='vertical' />
                <Space direction={'vertical'}>
                  <Text strong>Phenotype</Text>
                  <Radio.Group defaultValue={specifyDataCols[0]}>
                    <Space direction={'vertical'}>
                      {specifyDataCols.map(col => <Radio key={col} value={col}>{col}</Radio>)}
                    </Space>
                  </Radio.Group>
                </Space>
              </Space>
            </div>
            : null}
        </Space>
      );
    }
    case 2: {
      return (
        <div className='vaGWAS__mainArea'>
          <Form
            form={form}
            layout='vertical'
            initialValues={{
              'genotype-cutoff': 0.2,
              'sample-cutoff': 0.04,
              'maf-cutoff': 0.05,
            }}
            onFieldsChange={(_, allFields) => {
              if (allFields.some(field => !field.validating && field.errors.length > 0)) {
                this.setState({ enableStep2NextButton: false });
              } else if (allFields.every(field => !field.validating && field.errors.length === 0)) {
                this.setState({ enableStep2NextButton: true });
              }
            }}
            // onFinish={onFinish}
            // onFinishFailed={console.log('sss')}
          >
            <Space className='vaGWAS__step1-specifyTable_innerSpace' split={<Divider type='vertical' />} >
              <Form.Item
                className='vaGWAS__step1-specifyTable_formItem'
                label={<Text strong>Genotype Cutoff</Text>}
                name='genotype-cutoff'
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
                className='vaGWAS__step1-specifyTable_formItem'
                label={<Text strong>Sample Cutoff</Text>}
                name='sample-cutoff'
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
                className='vaGWAS__step1-specifyTable_formItem'
                label={<Text strong>MAF Cutoff</Text>}
                name='maf-cutoff'
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

      return (
        <div className='vaGWAS__mainArea'>
          {(this.state.jobSubmitted) ?
            <Result
              status='success'
              title='GWAS Job Submitted Successfully'
              subTitle={`GWAS Job Name: ${this.state.jobName}`}
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
                      jobSubmitted: false,
                      enableStep2NextButton: false,
                    });
                  }}
                >
                  Done
                </Button>,
              ]}
            /> :
            <Form
              {...layout}
              name='control-hooks'
              onFinish={(values) => {
                this.setState({
                  jobName: values.GWASJobName,
                  jobSubmitted: true,
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
                >
              Submit
                </Button>
              </Form.Item>
            </Form>
          }
        </div>
      );
    }
    default:
      return <React.Fragment />;
    }
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

    const [form] = Form.useForm();
    return (
      <Space direction={'vertical'} style={{ width: '100%' }}>
        <Steps current={current}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className='steps-content'>{this.generateContentForStep(current, form)}</div>
        <div className='steps-action'>
          {current < steps.length - 1 && (
            <Button
              className='vaGWAS__step0-navBtn'
              type='primary'
              onClick={() => this.next()}
              disabled={!nextButtonEnabled}
            >
              Next
            </Button>
          )}
          {current > 0 && !this.state.jobSubmitted && (
            <Button className='vaGWAS__step0-navBtn' style={{ margin: '0 8px' }} onClick={() => this.prev()}>
              Previous
            </Button>
          )}
        </div>
      </Space>
    );
  }
}

VAGWAS.propTypes = {
  wssFileObjects: PropTypes.array,
  wssFilePrefix: PropTypes.string,
  wssListFileError: PropTypes.string,
  wssFileData: PropTypes.shape({
    workspaceKey: PropTypes.string.isRequired,
    fileData: PropTypes.array,
  }),
  onLoadWorkspaceStorageFileList: PropTypes.func.isRequired,
  onLoadWorkspaceStorageFile: PropTypes.func.isRequired,
};

VAGWAS.defaultProps = {
  wssFileObjects: undefined,
  wssFilePrefix: undefined,
  wssFileData: undefined,
  wssListFileError: undefined,
};

export default VAGWAS;
