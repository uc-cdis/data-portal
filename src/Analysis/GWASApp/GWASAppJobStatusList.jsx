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
import { has } from 'lodash';
import { fetchWithCreds } from '../../actions';
import { marinerUrl } from '../../localconf';
import './GWASApp.css';

const { Panel } = Collapse;
const { TextArea } = Input;

class GWASAppJobStatusList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showJobStatusModal: false,
      jobStatusModalData: '',
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
            this.handleJobStatusModalShow(listItem.runID, false);
          }}
        >
        show output file paths
        </Button>);
    }
    return actionButtons;
  }

  cancelMarinerJob = (runID) => {
    fetchWithCreds({
      path: `${marinerUrl}/${runID}/cancel`,
      method: 'POST',
    }).then(this.props.getMarinerJobStatusFuncCallback());
  }

  handleJobStatusModalCancel = () => {
    this.setState({
      showJobStatusModal: false,
    });
  };

  // displayFullLog == true by default to display the entire Mariner log
  // set it to false to only display the '.main.outputs' section
  handleJobStatusModalShow = (runID, displayFullLog = true) => {
    fetchWithCreds({
      path: `${marinerUrl}/${runID}`,
      method: 'GET',
    })
      .then(({ data }) => {
        let logData = data;
        if (!displayFullLog) {
          if (has(data, 'log.main.output')) {
            logData = data.log.main.output;
          } else {
            logData = {
              message: 'no output available',
            };
          }
        }
        this.setState({
          jobStatusModalData: JSON.stringify(logData, undefined, 2),
          showJobStatusModal: true,
        });
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
      </div>
    );
  }
}

GWASAppJobStatusList.propTypes = {
  marinerJobStatus: PropTypes.array,
  getMarinerJobStatusFuncCallback: PropTypes.func.isRequired,
};

GWASAppJobStatusList.defaultProps = {
  marinerJobStatus: [],
};

export default GWASAppJobStatusList;
