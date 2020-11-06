import React from 'react';
import { Steps, Button, Space, Table, Modal, Typography, Checkbox, Radio, Divider, Switch, Select, Input, Form, message } from 'antd';
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

const data = [
  {
    key: 'data1',
    fileName: 'covariant.tsv',
    fileSize: 301,
    createDate: '2020-10-20',
    fileData: [
      {
        '#FID': '1334',
        IID: 'NA12144',
        TCELL_FH: '0.089589121751',
        VITAL_STATUS: '2',
      },
      {
        '#FID': '1334',
        IID: 'NA12145',
        TCELL_FH: '0.801026947046',
        VITAL_STATUS: '1',
      },
      {
        '#FID': '1334',
        IID: 'NA12146',
        TCELL_FH: '0.813497757167',
        VITAL_STATUS: '2',
      },
      {
        '#FID': '1334',
        IID: 'NA12239',
        TCELL_FH: '0.101904839219',
        VITAL_STATUS: '1',
      },
      {
        '#FID': '1340',
        IID: 'NA06994',
        TCELL_FH: '0.667869278066',
        VITAL_STATUS: '1',
      },
      {
        '#FID': '1340',
        IID: 'NA07000',
        TCELL_FH: '0.255018302544',
        VITAL_STATUS: '1',
      },
      {
        '#FID': '1340',
        IID: 'NA07022',
        TCELL_FH: '0.774015640282',
        VITAL_STATUS: '2',
      },
      {
        '#FID': '1340',
        IID: 'NA07056',
        TCELL_FH: '0.479203782968',
        VITAL_STATUS: '2',
      },
      {
        '#FID': '1341',
        IID: 'NA07034',
        TCELL_FH: '0.270902090036',
        VITAL_STATUS: '1',
      },
    ],
  },
  {
    key: 'data2',
    fileName: 'phenotype.tsv',
    fileSize: 301,
    createDate: '2020-10-20',
    fileData: [
      {
        '#FID': '1334',
        IID: 'NA12144',
        TCELL_FH: '1.089589121751',
        VITAL_STATUS: '2',
      },
      {
        '#FID': '1334',
        IID: 'NA12145',
        TCELL_FH: '1.801026947046',
        VITAL_STATUS: '1',
      },
      {
        '#FID': '1334',
        IID: 'NA12146',
        TCELL_FH: '1.813497757167',
        VITAL_STATUS: '2',
      },
      {
        '#FID': '1334',
        IID: 'NA12239',
        TCELL_FH: '1.101904839219',
        VITAL_STATUS: '1',
      },
      {
        '#FID': '1340',
        IID: 'NA06994',
        TCELL_FH: '1.667869278066',
        VITAL_STATUS: '1',
      },
      {
        '#FID': '1340',
        IID: 'NA07000',
        TCELL_FH: '1.255018302544',
        VITAL_STATUS: '1',
      },
      {
        '#FID': '1340',
        IID: 'NA07022',
        TCELL_FH: '1.774015640282',
        VITAL_STATUS: '2',
      },
      {
        '#FID': '1340',
        IID: 'NA07056',
        TCELL_FH: '1.479203782968',
        VITAL_STATUS: '2',
      },
      {
        '#FID': '1341',
        IID: 'NA07034',
        TCELL_FH: '1.270902090036',
        VITAL_STATUS: '1',
      },
    ],
  },
  {
    key: 'data3',
    fileName: 'combined.tsv',
    fileSize: 298,
    createDate: '2020-10-20',
    fileData: [
      {
        '#FID': '1334',
        IID: 'NA12144',
        TCELL_FH: '0.089589121751',
        TCELL_FH2: '2',
      },
      {
        '#FID': '1334',
        IID: 'NA12145',
        TCELL_FH: '0.801026947046',
        TCELL_FH2: '1',
      },
      {
        '#FID': '1334',
        IID: 'NA12146',
        TCELL_FH: '0.813497757167',
        TCELL_FH2: '2',
      },
      {
        '#FID': '1334',
        IID: 'NA12239',
        TCELL_FH: '0.101904839219',
        TCELL_FH2: '1',
      },
      {
        '#FID': '1340',
        IID: 'NA06994',
        TCELL_FH: '0.667869278066',
        TCELL_FH2: '1',
      },
      {
        '#FID': '1340',
        IID: 'NA07000',
        TCELL_FH: '0.255018302544',
        TCELL_FH2: '1',
      },
      {
        '#FID': '1340',
        IID: 'NA07022',
        TCELL_FH: '0.774015640282',
        TCELL_FH2: '2',
      },
      {
        '#FID': '1340',
        IID: 'NA07056',
        TCELL_FH: '0.479203782968',
        TCELL_FH2: '2',
      },
      {
        '#FID': '1341',
        IID: 'NA07034',
        TCELL_FH: '0.270902090036',
        TCELL_FH2: '1',
      },
    ],
  },
];

class VAGWASMockup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      showStep0Table: false,
      showPreviewModal: false,
      previewModalData: undefined,
      previewModalFileName: undefined,
      step0SelectedData: undefined,
      showStep1SelectionTable: false,
      showStep1SpecifyTable: false,
      step1SelectedData: undefined,
    };
  }

  mainTableRowSelection = {
    type: 'radio',
    onChange: (_, selectedRows) => {
      if (this.state.current === 0) {
        this.setState({
          step0SelectedData: selectedRows,
        });
      } else if (this.state.current === 1) {
        this.setState({
          step1SelectedData: selectedRows,
        });
      }
    },
  };

  mainTableConfig = [
    {
      title: 'File Name',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: 'File Size',
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: text => humanFileSize(text),
    },
    {
      title: 'Create Date',
      dataIndex: 'createDate',
      key: 'createDate',
    },
    {
      title: 'Action',
      key: 'action',
      render: record => (<Space size='small'>
        <Button
          size='small'
          type='link'
          onClick={() => {
            this.setState({
              showPreviewModal: true,
              previewModalData: record.fileData.map((d, i) => ({ key: `dataIndex${i}`, ...d })),
              previewModalFileName: record.fileName,
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
      previewModalData: undefined,
      previewModalFileName: undefined,
    });
  };

  next() {
    const current = this.state.current + 1;
    this.setState({
      current,
      showPreviewModal: (current === 0),
      showStep0Table: (current === 0),
    });
  }

  prev() {
    const current = this.state.current - 1;
    const step0SelectedData = (current === 0) ? undefined : this.state.step0SelectedData;
    this.setState({
      current,
      step0SelectedData,
    });
  }

  generateContentForStep = (stepIndex) => {
    switch (stepIndex) {
    case 0: {
      let modalTableColumnConfig;
      if (this.state.previewModalData && this.state.previewModalData.length > 0) {
        modalTableColumnConfig = Object.keys(this.state.previewModalData[0]).map(key => ({
          title: key,
          dataIndex: key,
          key,
        }));
      }
      return (
        <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
          <Button
            onClick={() => { this.setState({ showStep0Table: true }); }}
            disabled={this.state.showStep0Table}
          >
            Select File
          </Button>
          {(this.state.showStep0Table) ?
            <div className='vaGWAS__mainTable'>
              <Table
                rowSelection={this.mainTableRowSelection}
                columns={this.mainTableConfig}
                dataSource={data}
              />
            </div>
            : null}
          <Modal
            visible={this.state.showPreviewModal}
            closable={false}
            title={`Preview File Content: ${this.state.previewModalFileName}`}
            footer={[
              <Button key='close' onClick={this.handlePreviewModalCancel}>
              Close
              </Button>,
            ]}
          >
            {(modalTableColumnConfig) ?
              <Table size={'small'} columns={modalTableColumnConfig} dataSource={this.state.previewModalData} /> : null}
          </Modal>
        </Space>
      );
    }
    case 1: {
      let specifyDataCols;
      if (this.state.step1SelectedData) {
        specifyDataCols = Object.keys(this.state.step1SelectedData[0].fileData[0])
          .map(colKey => colKey);
      }
      let modalTableColumnConfig;
      if (this.state.previewModalData && this.state.previewModalData.length > 0) {
        modalTableColumnConfig = Object.keys(this.state.previewModalData[0]).map(key => ({
          title: key,
          dataIndex: key,
          key,
        }));
      }
      return (
        <Space direction={'vertical'} align={'center'} style={{ width: '100%' }}>
          <Space>
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
                  step1SelectedData: this.state.step0SelectedData,
                  showStep1SelectionTable: false,
                });
              }}
            >
            Specify from File Selected in Previous Step
            </Button>
          </Space>
          {(this.state.showStep1SelectionTable) ?
            <div className='vaGWAS__mainTable'>
              <Table
                rowSelection={this.mainTableRowSelection}
                columns={this.mainTableConfig}
                dataSource={data}
              />
            </div>
            : null}
          <Modal
            visible={this.state.showPreviewModal}
            closable={false}
            title={`Preview File Content: ${this.state.previewModalFileName}`}
            footer={[
              <Button key='close' onClick={this.handlePreviewModalCancel}>
              Close
              </Button>,
            ]}
          >
            {(modalTableColumnConfig) ?
              <Table size={'small'} columns={modalTableColumnConfig} dataSource={this.state.previewModalData} /> : null}
          </Modal>
          {(this.state.step1SelectedData && specifyDataCols) ?
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
            <Switch style={{ width: '30px' }} />
            <Text>Dichotomic phenotype</Text>
          </Space>
          <Divider />
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
          <Form {...layout} name='control-hooks'>
            <Form.Item name='GWAS_job_id' label='GWAS Job ID' rules={[{ required: true }]}>
              <Input addonBefore='GWAS_job' placeholder='1234-1245-12345' />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Space>
                <Button htmlType='button' onClick={() => { message.warning('Estimating...'); }}>
              Estimate
                </Button>
                <Text >Or</Text>
                <Button htmlType='submit' type='primary' onClick={() => { message.success('Job submitted!'); }}>
              Submit
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      );
    }
    default:
      return <React.Fragment />;
    }
  }

  render() {
    const { current } = this.state;
    const nextButtonEnabled = (current === 0 && this.state.step0SelectedData)
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
          {current > 0 && (
            <Button className='vaGWAS__step0-navBtn' style={{ margin: '0 8px' }} onClick={() => this.prev()}>
              Previous
            </Button>
          )}
        </div>
      </Space>
    );
  }
}

export default VAGWASMockup;
