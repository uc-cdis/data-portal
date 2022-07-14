import React from 'react';
import {
  Button, List, Tag, Popconfirm,
} from 'antd';
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
  MinusCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation } from 'react-query';
import PropTypes from 'prop-types';
import { gwasWorkflowPath } from '../../localconf';
import { headers } from '../../configs';
import { getPresignedUrl } from '../AnalysisJob';

const GWASJob = ({ workflow, refreshWorkflows }) => {
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

    if (phase === 'Succeeded') {
      actionUrl = `${gwasWorkflowPath}status/${workflowName}`;
      buttonText = 'download outputs';
      buttonClickHandler = handleWorkflowOutput;
    } else if (phase === 'Failed') {
      actionUrl = `${gwasWorkflowPath}logs/${workflowName}`;
      buttonText = 'view logs';
      buttonClickHandler = handleWorkflowLogs;
    }
    if (['Succeeded', 'Failed'].includes(phase)) {
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
    case 'Running':
      return (
        <Tag icon={<SyncOutlined spin />} color='processing'>
            In Progress
        </Tag>
      );
    case 'Succeeded':
      return (
        <Tag icon={<CheckCircleOutlined />} color='success'>
            Completed
        </Tag>
      );
    case 'Failed':
      return (
        <Tag icon={<CloseCircleOutlined />} color='error'>
            Failed
        </Tag>
      );
    case 'Canceling':
      return (
        <Tag icon={<MinusCircleOutlined />} color='warning'>
        Canceling
        </Tag>
      );
    case 'Canceled':
      return (
        <Tag icon={<StopOutlined />} color='warning'>
        Canceled
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

  async function fetchGwasCancel() {
    const cancelEndpoint = `${gwasWorkflowPath}cancel/${workflow}`;
    const res = await fetch(cancelEndpoint, { method: 'POST', headers });
    return res;
  }

  const useCancelJob = () => {
    const deletion = useMutation(fetchGwasCancel, {
      onSuccess: () => {
        refreshWorkflows();
      },
    });
    return deletion;
  };

  const GWASDelete = () => {
    const cancelJob = useCancelJob();
    return (
      <Popconfirm
        title='Are you sure you want to cancel this job?'
        onConfirm={(event) => {
          event.stopPropagation();
          cancelJob.mutate();
        }}
        okText='Yes'
        cancelText='No'
      >
        <Button type='link' size='medium' danger>delete</Button>
      </Popconfirm>
    );
  };

  async function fetchWorkflowStatus() {
    const statusEndpoint = `${gwasWorkflowPath}status/${workflow}`;
    const status = await fetch(statusEndpoint);
    return status.json();
  }

  const Status = () => {
    const { data, status } = useQuery(['workflowId', workflow], fetchWorkflowStatus, {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: 60000,
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
                <dt>Started at {data.startedAt} and finished at {finishedAt}</dt>
              </dl>
            )}

          />
          <div>{getStatusTag(data.phase)}</div>
          {/* <GWASDelete /> */}
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
  refreshWorkflows: PropTypes.func.isRequired,
};

export default GWASJob;
