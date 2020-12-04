import React from 'react';
import PropTypes from 'prop-types';
import { Steps, Button, Space, Table, Modal, Typography, Checkbox, Radio, Divider, Select, Input, Form, Result, Spin } from 'antd';
import { humanFileSize } from '../utils.js';
import './VAGWASMockup.css';

const { Step } = Steps;
const { Text } = Typography;
const { Option } = Select;

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

class VAGWASMockup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      showStep0Table: false,
      showPreviewModal: false,
      previewModalDataKey: undefined,
      step0SelectedDataKey: undefined,
      // showStep1SelectionTable: false,
      // showStep1SpecifyTable: false,
      // step1SelectedData: undefined,
      jobName: undefined,
      jobSubmitted: false,
    };
  }

  componentDidMount() {
    this.props.onLoadWorkspaceStorageFileList();
  }

  mainTableRowSelection = {
    type: 'radio',
    onChange: (_, selectedRows) => {
      // if (this.state.current === 0) {
      this.setState({
        step0SelectedDataKey: selectedRows[0].WorkspaceKey,
      });
      // } else if (this.state.current === 1) {
      //   this.setState({
      //     step1SelectedData: selectedRows[0].WorkspaceKey,
      //   });
      // }
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
        || this.props.wssFileData.WorkspaceKey !== this.state.step0SelectedDataKey) {
        this.props.onLoadWorkspaceStorageFile(this.state.step0SelectedDataKey);
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
    const step0SelectedDataKey = (current === 0) ? undefined : this.state.step0SelectedDataKey;
    this.setState({
      current,
      step0SelectedDataKey,
    });
  }

  generateContentForStep = (stepIndex) => {
    switch (stepIndex) {
    case 0: {
      let modalTableColumnConfig;
      if (this.props.wssFileData) {
        modalTableColumnConfig = Object.keys(this.props.wssFileData[0]).filter(element => element !== 'key').map(key => ({
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
              <Table size={'small'} columns={modalTableColumnConfig} dataSource={this.props.wssFileData} /> :
              (<Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
                <Spin size='large' tip='Loading data from workspace storage...' />
              </Space>)}
          </Modal>
        </Space>
      );
    }
    case 1: {
      let specifyDataCols;
      if (this.props.wssFileData) {
        specifyDataCols = Object.keys(this.props.wssFileData[0])
          .filter(element => element !== 'IID' && element !== 'FID')
          .map(colKey => colKey);
      }
      // let modalTableColumnConfig;
      // if (this.props.wssFileData) {
      //   modalTableColumnConfig = Object.keys(this.props.wssFileData[0]).map(key => ({
      //     title: key,
      //     dataIndex: key,
      //     key,
      //   }));
      // }
      return (
        <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
          {/* <Space>
            <Button
              onClick={() => {
                this.setState({
                  showStep1SelectionTable: true,
                  step1SelectedData: undefined,
                });
              }}
              disabled={this.state.showStep1SelectionTable}
            >
            Select File
            </Button>
            <Text>Or</Text>
            <Button
              onClick={() => {
                this.setState({
                  step1SelectedData: this.state.step0SelectedDataKey,
                  showStep1SelectionTable: false,
                });
              }}
            >
            Specify from File Selected in Previous Step
            </Button>
          </Space> */}
          {/* {(this.state.showStep1SelectionTable) ?
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
              <Table size={'small'} columns={modalTableColumnConfig} dataSource={this.props.wssFileData} /> : null}
          </Modal> */}
          {(this.props.wssFileData && specifyDataCols) ?
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
          <Space>
            <Space direction={'vertical'}>
              <Text strong>Min Allele Frequency</Text>
              <Select defaultValue='0.01'>
                <Option value='0.001'>0.001</Option>
                <Option value='0.002'>0.002</Option>
                <Option value='0.005'>0.005</Option>
                <Option value='0.01'>0.01</Option>
                <Option value='0.02'>0.02</Option>
                <Option value='0.05'>0.05</Option>
              </Select>
            </Space>
            <Divider type='vertical' />
            <Space direction={'vertical'}>
              <Text strong>Association Model</Text>
              <Select defaultValue='linear'>
                <Option value='linear'>Linear</Option>
                <Option value='modelA'>Model A</Option>
                <Option value='modelB'>Model B</Option>
                <Option value='modelC'>Model C</Option>
              </Select>
            </Space>
            <Divider type='vertical' />
            <Space direction={'vertical'}>
              <Text strong>Parameter 1</Text>
              <Select />
            </Space>
            <Divider type='vertical' />
            <Space direction={'vertical'}>
              <Text strong>Parameter 2</Text>
              <Select />
            </Space>
          </Space>
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
                      step0SelectedDataKey: undefined,
                      // showStep1SelectionTable: false,
                      // showStep1SpecifyTable: false,
                      // step1SelectedData: undefined,
                      jobName: undefined,
                      jobSubmitted: false,
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
    const nextButtonEnabled = (current === 0 && this.state.step0SelectedDataKey)
    || (current === 1 && this.state.step1SelectedData)
    || (current === 2);

    return (
      <Space direction={'vertical'} style={{ width: '100%' }}>
        <Steps current={current}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className='steps-content'>{this.generateContentForStep(current)}</div>
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

VAGWASMockup.propTypes = {
  wssFileObjects: PropTypes.array,
  wssFilePrefix: PropTypes.string,
  wssListFileError: PropTypes.string,
  wssFileData: PropTypes.array,
  onLoadWorkspaceStorageFileList: PropTypes.func.isRequired,
  onLoadWorkspaceStorageFile: PropTypes.func.isRequired,
};

VAGWASMockup.defaultProps = {
  wssFileObjects: undefined,
  wssFilePrefix: undefined,
  wssFileData: undefined,
  wssListFileError: undefined,
};

export default VAGWASMockup;
