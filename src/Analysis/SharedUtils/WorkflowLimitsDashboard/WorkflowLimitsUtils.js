import { headers } from '../../../configs';
import { gwasWorkflowPath } from '../../../localconf';

export const fetchMonthlyWorkflowLimitInfo = async () => {
  const workflowsEndpoint = `${gwasWorkflowPath}workflows/user-monthly`;
  const response = await fetch(workflowsEndpoint, { headers });
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
};

export const workflowLimitsLoadingErrorMessage =
  'Unable to gather user workflow information.';

export const workflowLimitsInvalidDataMessage =
  'Invalid server response for user workflow information.';

export const workflowLimitInfoIsValid = (data) => {
  console.log(data);
  // Check if data is an object
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  const expectedKeys = ['workflow_run', 'workflow_limit'];
  // validate data contains expected keys and they're numeric
  if (
    typeof data?.workflow_run !== 'number' ||
    typeof data?.workflow_limit !== 'number'
  ) {
    return false;
  }
  return true;
};
