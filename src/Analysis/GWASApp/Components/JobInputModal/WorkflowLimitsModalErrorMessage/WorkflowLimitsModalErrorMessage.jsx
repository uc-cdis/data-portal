import React from 'react';
import PropTypes from 'prop-types';
import {
  workflowLimitsInvalidDataMessage,
  workflowLimitsLoadingErrorMessage,
} from '../../../../SharedUtils/WorkflowLimitsDashboard/WorkflowLimitsUtils';
import { components } from '../../../../../params';
import './WorkflowLimitsModalErrorMessage.css';

const supportEmail = components.login?.email || 'support@datacommons.io';

const WorkflowLimitsModalErrorMessage = ({
  status,
  workflowLimitInfoIsValid,
  workFlowLimitExceeded,
}) => (
  <div className='workflow-limits-modal-error-message'>
    {status === 'error' && <div>{workflowLimitsLoadingErrorMessage}</div>}
    {status === 'success' && !workflowLimitInfoIsValid && (
      <div>{workflowLimitsInvalidDataMessage}</div>
    )}
    {status === 'success' &&
      workflowLimitInfoIsValid &&
      workFlowLimitExceeded && (
        <div className='long-message'>
          Workflow limit reached. Please contact support for assistance:{' '}
          <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
        </div>
      )}
  </div>
);

WorkflowLimitsModalErrorMessage.propTypes = {
  status: PropTypes.string.isRequired,
  workflowLimitInfoIsValid: PropTypes.bool.isRequired,
};

export default WorkflowLimitsModalErrorMessage;
