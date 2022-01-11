import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Modal, Input, Collapse, List, Tag, Popconfirm,
} from 'antd';
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import './GWASUIApp.css';

const { Panel } = Collapse;
const { TextArea } = Input;

class GWASUIJobStatusList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showJobStatusModal: false,
      jobStatusModalData: '',
      showJobCompleteModal: false,
      jobCompleteModalData: [],
    };
  }

  getStatusTag = (jobStatus) => {
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

  getActionButtons = (listItem) => {
    const actionButtons = [<Button type='link' size='small' onClick={(event) => { event.stopPropagation(); this.handleJobStatusModalShow(listItem.runID); }}>show logs</Button>];
    if (listItem.status === 'running') {
      actionButtons.unshift(
        <Popconfirm
          title='Are you sure you want to cancel this job?'
          onConfirm={(event) => {
            event.stopPropagation();
            this.cancelMarinerJob(listItem.runID);
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
          type='link'
          size='small'
          onClick={(event) => {
            event.stopPropagation();
            this.handleJobCompleteModalShow(listItem);
          }}
        >
        show output files
        </Button>);
    }
    return actionButtons;
  }

  cancelMarinerJob = (runID) => {
    const marinerJobStatusCopy = [...this.props.marinerJobStatus];
    const pos = marinerJobStatusCopy.findIndex((e) => e.runID === runID);
    if (pos >= 0) marinerJobStatusCopy[pos].status = 'cancelled';
    this.props.updateMarinerJobStatusFuncCallback(marinerJobStatusCopy);
  }

  handleJobStatusModalCancel = () => {
    this.setState({
      showJobStatusModal: false,
    });
  };

  handleJobStatusModalShow = (runID) => {
    this.setState({
      jobStatusModalData: `This is the log for Mariner job run ${runID}`,
      showJobStatusModal: true,
    });
  };

  handleJobCompleteModalCancel = () => {
    this.setState({
      showJobCompleteModal: false,
    });
  };

  handleJobCompleteModalShow = (marinerJob) => {
    this.setState({
      jobCompleteModalData: marinerJob.output,
      showJobCompleteModal: true,
    });
  };

  render() {
    return (
      <div className='GWASApp-jobStatus'>
        <Collapse onClick={(event) => event.stopPropagation()}>
          <Panel header='Submitted Job Status' key='1'>
            <List
              className='GWASApp__jobStatusList'
              itemLayout='horizontal'
              pagination={{ pageSize: 5 }}
              dataSource={this.props.marinerJobStatus}
              renderItem={(item) => (
                <List.Item
                  actions={this.getActionButtons(item)}
                >
                  <List.Item.Meta
                    title={`Run ID: ${item.runID}`}
                    description={(item.jobName) ? `GWAS Job Name: ${item.jobName}` : null}
                  />
                  <div>{this.getStatusTag(item.status)}</div>
                </List.Item>
              )}
            />
          </Panel>
        </Collapse>
        <Modal
          visible={this.state.showJobStatusModal}
          closable={false}
          title={'Show job logs'}
          footer={[
            <Button key='close' onClick={this.handleJobStatusModalCancel}>
              Close
            </Button>,
          ]}
        >
          <TextArea rows={10} value={this.state.jobStatusModalData} readOnly />
        </Modal>
        <Modal
          visible={this.state.showJobCompleteModal}
          closable={false}
          title={'Show job outputs'}
          footer={[
            <Button key='close' onClick={this.handleJobCompleteModalCancel}>
              Close
            </Button>,
          ]}
        >
          <List
            itemLayout='horizontal'
            dataSource={this.state.jobCompleteModalData}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <a key='list-view-btn' href={item.url} target='_blank' rel='noreferrer'>
                    view
                  </a>,
                ]}
              >
                <div>{item.name}</div>
              </List.Item>
            )}
          />
        </Modal>
      </div>
    );
  }
}

GWASUIJobStatusList.propTypes = {
  marinerJobStatus: PropTypes.array,
  updateMarinerJobStatusFuncCallback: PropTypes.func.isRequired,
};

GWASUIJobStatusList.defaultProps = {
  marinerJobStatus: [],
};

export default GWASUIJobStatusList;
