import React from 'react';
import {
  Button, List, Tag,
} from 'antd';
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
  LoadingOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useQuery } from 'react-query';
import PropTypes from 'prop-types';
import { gwasWorkflowPath } from '../../../localconf';
import { headers } from '../../../configs';
import { getPresignedUrl } from '../../AnalysisJob';
import { gwasStatus } from './constants';

const GWASJob = ({ workflow }) => {
  async function handleWorkflowOutput(url) {
    const response = await fetch(url, { headers }).then((res) => res.json()).then((data) => data);
    if (response) {
      getPresignedUrl(JSON.parse(response.outputs.parameters[0].value).did, 'download')
        .then((res) => {
          window.open(res, '_blank');
        });
    }
  }

  async function handleWorkflowLogs(url) {
    window.open(url, '_blank');
  }

  const getActionButtons = (phase, workflowName) => {
    const actionButtons = [];
    let actionUrl;
    let buttonText;
    let buttonClickHandler;

    if (phase === gwasStatus.succeeded) {
      actionUrl = `${gwasWorkflowPath}status/${workflowName}`;
      buttonText = 'download outputs';
      buttonClickHandler = handleWorkflowOutput;
    } else if (phase === gwasStatus.failed) {
      actionUrl = `${gwasWorkflowPath}logs/${workflowName}`;
      buttonText = 'view logs';
      buttonClickHandler = handleWorkflowLogs;
    }
    if ([gwasStatus.succeeded, gwasStatus.failed].includes(phase)) {
      actionButtons.unshift(
        <Button
          primary='true'
          type='link'
          size='small'
          className='GWAS-completedBtn'
          style={{ width: '150px' }}
          onClick={(event) => {
            event.stopPropagation();
            buttonClickHandler(actionUrl);
          }}
        >
          {buttonText}
        </Button>,
      );
    }
    return actionButtons;
  };

  const getStatusTag = (phase) => {
    if (!phase) {
      return (
        <Tag icon={<QuestionCircleOutlined />} color='default'>
          Unknown
        </Tag>
      );
    }
    switch (phase) {
    case gwasStatus.running:
      return (
        <Tag icon={<SyncOutlined spin />} color='processing'>
            In Progress
        </Tag>
      );
    case gwasStatus.succeeded:
      return (
        <Tag icon={<CheckCircleOutlined />} color='success'>
            Completed
        </Tag>
      );
    case gwasStatus.failed:
      return (
        <Tag icon={<CloseCircleOutlined />} color='error'>
            Failed
        </Tag>
      );
    case gwasStatus.pending:
      return (
        <Tag icon={<LoadingOutlined />} color='processing'>
            Pending
        </Tag>
      );
    case gwasStatus.error:
      return (
        <Tag icon={<CloseOutlined />} color='error'>
            Error
        </Tag>
      );
    default:
      return (
        <Tag icon={<QuestionCircleOutlined />} color='default'>
            Unknown
        </Tag>
      );
    }
  };

  async function fetchWorkflowStatus() {
    const statusEndpoint = `${gwasWorkflowPath}status/${workflow.name}`;
    const status = await fetch(statusEndpoint);
    return status.json();
  }

  const Status = () => {
    const { data, status } = useQuery(['workflowId', workflow.name, workflow.phase], fetchWorkflowStatus, {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false
    });
    if (status === 'loading') {
      return <React.Fragment>Loading</React.Fragment>;
    }
    if (status === 'error') {
      return <React.Fragment />;
    }
    const finishedAt = (data.finishedAt === null) ? '' : data.finishedAt;
    return (
      <React.Fragment>
        <List.Item
          actions={getActionButtons(data.phase, data.name)}
        >
          <List.Item.Meta
            title={`Run ID: ${data.name}`}
            description={(
              <dl>
                <dt>Workflow Name: {data.wf_name}</dt>
                <dt>Started at {data.startedAt} {data.phase === gwasStatus.succeeded ? `and finished at ${finishedAt}` : ''}</dt>
              </dl>
            )}

          />
          <div>{getStatusTag(data.phase)}</div>
        </List.Item>
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <Status workflow={workflow} />
    </React.Fragment>
  );
};

GWASJob.propTypes = {
  workflow: PropTypes.string.isRequired,
};

export default GWASJob;
