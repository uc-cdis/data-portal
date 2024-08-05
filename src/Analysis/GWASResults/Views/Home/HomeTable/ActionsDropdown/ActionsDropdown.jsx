import React from 'react';
import PropTypes from 'prop-types';
import { Space, Dropdown, Button, notification } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { components } from '../../../../../../params';
import {
  fetchMonthlyWorkflowLimitInfo,
  workflowLimitInfoIsValid,
  workflowLimitsInvalidDataMessage,
} from '../../../../../SharedUtils/WorkflowLimitsDashboard/WorkflowLimitsUtils';
import {
  fetchPresignedUrlForWorkflowArtifact,
  retryWorkflow,
} from '../../../../Utils/gwasWorkflowApi';
import PHASES from '../../../../Utils/PhasesEnumeration';

const ActionsDropdown = ({ record }) => {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (notificationMessage) => {
    api.open({
      message: notificationMessage,
      description: '',
      duration: 0,
    });
  };

  const supportEmail = components.login?.email || 'support@datacommons.io';
  const checkWorkflowLimit = async () => {
    try {
      const data = await fetchMonthlyWorkflowLimitInfo(); // Await the function to get the JSON data
      console.log('Received workflow data: ', data); // Log the received data
      if (!workflowLimitInfoIsValid(data)) {
        console.log('workflow limit info sent is invalid: ', data);
        openNotification(
          <>
            <h3 style={{ color: '#2E77B8' }}>Monthly Workflow Limit</h3>
            {workflowLimitsInvalidDataMessage}
          </>
        );
        return false;
      } else if (data['workflow_run'] >= data['workflow_limit']) {
        console.log('HERE!!! HERE!! ');
        openNotification(
          <>
            <h3 style={{ color: '#2E77B8' }}>Monthly Workflow Limit</h3>Workflow
            limit reached. Please contact support for assistance:{' '}
            <a href={supportEmail}>{supportEmail}</a>
          </>
        );
        return false;
      } else {
        // workflow info is valid, return true to continue to Retry workflow
        return true;
      }
    } catch (error) {
      console.error('Error fetching workflow limit info: ', error); // Log errors if any
    }
    /*
    const { data } = await fetchMonthlyWorkflowLimitInfo();
    console.log('recieved workflow data: ', data);
    if (!workflowLimitInfoIsValid(data)) {
      openNotification(
        <>
          <h3 style={{ color: '#2E77B8' }}>Monthly Workflow Limit</h3>
          {workflowLimitsInvalidDataMessage}
        </>
      );
      return false;
    } else if (data.workflowRun >= data.workflowLimit) {
      openNotification(
        <>
          <h3 style={{ color: '#2E77B8' }}>Monthly Workflow Limit</h3>Workflow
          limit reached. Please contact support for assistance:{' '}
          <a href={supportEmail}>{supportEmail}</a>
        </>
      );
      return false;
    } else {
      // workflow info is valid, return true to continue to Retry workflow
      return true;
    }
      */
  };

  const checkWorkflowLimitThenRetryWorkflow = async () => {
    const isUserUnderWorkflowLimit = await checkWorkflowLimit();
    alert(isUserUnderWorkflowLimit);
    if (isUserUnderWorkflowLimit === true) {
      retryWorkflow(record.name, record.uid)
        .then(() => {
          openNotification('Workflow successfully restarted.');
        })
        .catch(() => {
          openNotification('❌ Retry request failed.');
        });
    } else {
      return null;
    }
  };

  const items = [
    {
      key: '1',
      label: (
        <a
          href=''
          onClick={(e) => {
            e.preventDefault();
            fetchPresignedUrlForWorkflowArtifact(
              record.name,
              record.uid,
              'gwas_archive_index'
            )
              .then((res) => {
                window.open(res, '_blank');
              })
              .catch((error) => {
                openNotification(`❌ Could not download. \n\n${error}`);
              });
          }}
        >
          Download
        </a>
      ),
      disabled: record.phase !== PHASES.Succeeded,
    },
    {
      key: '2',
      label: (
        <a
          href=''
          onClick={(e) => {
            e.preventDefault();
            checkWorkflowLimitThenRetryWorkflow(record.name, record.uid);
            /*             retryWorkflow(record.name, record.uid)
              .then(() => {
                openNotification('Workflow successfully restarted.');
              })
              .catch(() => {
                openNotification('❌ Retry request failed.');
              }); */
          }}
        >
          Retry
        </a>
      ),
      disabled: record.phase !== PHASES.Error && record.phase !== PHASES.Failed, // eslint-disable-line
    },
  ];

  return (
    <React.Fragment>
      {contextHolder}
      <Dropdown menu={{ items }} trigger={['click']}>
        <Space>
          <Button type='text'>
            <EllipsisOutlined />
          </Button>
        </Space>
      </Dropdown>
    </React.Fragment>
  );
};

ActionsDropdown.propTypes = {
  record: PropTypes.object.isRequired,
};

export default ActionsDropdown;
