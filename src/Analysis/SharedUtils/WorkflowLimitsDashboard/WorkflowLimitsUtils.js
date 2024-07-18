import { headers } from '../../../configs';
import { gwasWorkflowPath } from '../../../localconf';

export const workflowLimitsLoadingErrorMessage = 'Unable to gather user workflow information.';

export const workflowLimitsInvalidDataMessage = 'Invalid server response for user workflow information.';

export const fetchMonthlyWorkflowLimitInfo = async () => {
  const workflowsEndpoint = `${gwasWorkflowPath}workflows/user-monthly`;
  const response = await fetch(workflowsEndpoint, { headers });
  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
};

export const workflowLimitInfoIsValid = (data) => {
  // Check if data is an object
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  // validate data contains expected keys and they're numeric
  if (
    typeof data?.workflow_run !== 'number'
    || typeof data?.workflow_limit !== 'number'
  ) {
    return false;
  }
  return true;
};
