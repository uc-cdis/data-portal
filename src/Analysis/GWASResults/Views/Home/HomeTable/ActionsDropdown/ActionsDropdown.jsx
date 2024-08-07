import React from 'react';
import PropTypes from 'prop-types';
import {
  Space, Dropdown, Button, notification, Spin,
} from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { components } from '../../../../../../params';
import {
  fetchMonthlyWorkflowLimitInfo,
  workflowLimitInfoIsValid,
  workflowLimitsInvalidDataMessage,
  workflowLimitsLoadingErrorMessage,
} from '../../../../../SharedUtils/WorkflowLimitsDashboard/WorkflowLimitsUtils';
import {
  fetchPresignedUrlForWorkflowArtifact,
  retryWorkflow,
} from '../../../../Utils/gwasWorkflowApi';
import PHASES from '../../../../Utils/PhasesEnumeration';

const ActionsDropdown = ({ record }) => {
  const [api, contextHolder] = notification.useNotification();

  // Updates notifaction if already open and the key matches
  // otherwise opens a new notification
  const openOrUpdateNotification = (notificationMessage, key) => {
    api.open({
      key,
      message: notificationMessage,
      description: '',
      duration: 0,
    });
  };

  const supportEmail = components.login?.email || 'support@datacommons.io';
  const checkWorkflowLimit = async () => {
    try {
      const data = await fetchMonthlyWorkflowLimitInfo();
      if (!workflowLimitInfoIsValid(data)) {
        openOrUpdateNotification(
          <React.Fragment>
            <h3 style={{ color: '#2E77B8' }}>Monthly Workflow Limit</h3>
            {workflowLimitsInvalidDataMessage}
          </React.Fragment>,
          'retry',
        );
        return false;
      }
      if (data.workflow_run >= data.workflow_limit) {
        openOrUpdateNotification(
          <React.Fragment>
            <h3 style={{ color: '#2E77B8' }}>Monthly Workflow Limit</h3>Workflow
            limit reached. Please contact support for assistance:{' '}
            <a href={supportEmail}>{supportEmail}</a>
          </React.Fragment>,
          'retry',
        );
        return false;
      }
      // workflow info is valid, return true to continue to Retry workflow
      return true;
    } catch (error) {
      openOrUpdateNotification(
        <React.Fragment>
          <h3 style={{ color: '#2E77B8' }}>Monthly Workflow Limit</h3>
          {workflowLimitsLoadingErrorMessage}
        </React.Fragment>,
        'retry',
      );
      console.error('Error fetching workflow limit info: ', error);
    }
    return false;
  };

  const checkWorkflowLimitThenRetryWorkflow = async () => {
    const isUserUnderWorkflowLimit = await checkWorkflowLimit();
    if (isUserUnderWorkflowLimit === true) {
      retryWorkflow(record.name, record.uid)
        .then(() => {
          openOrUpdateNotification('Workflow successfully restarted.', 'retry');
        })
        .catch((error) => {
          console.error(error);
          openOrUpdateNotification('❌ Retry request failed.', 'retry');
        });
    }
    return null;
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
              'gwas_archive_index',
            )
              .then((res) => {
                window.open(res, '_blank');
              })
              .catch((error) => {
                openOrUpdateNotification(
                  `❌ Could not download. \n\n${error}`,
                  'download',
                );
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
            openOrUpdateNotification(<Spin />, 'retry');
            checkWorkflowLimitThenRetryWorkflow(record.name, record.uid);
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
