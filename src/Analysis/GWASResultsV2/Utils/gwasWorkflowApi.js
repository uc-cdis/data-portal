import { headers } from '../../../configs';
import { gwasWorkflowPath } from '../../../localconf';
import { getPresignedUrl } from '../../AnalysisJob';

export const fetchPresignedUrlForWorkflowArtifact = async (
  workflowName,
  workflowUid,
  artifactName,
) => {
  const endPoint = `${gwasWorkflowPath}status/${workflowName}?uid=${workflowUid}`;
  const response = await fetch(endPoint, { headers })
    .then((res) => res.json())
    .then((data) => data);
  if (!response) {
    throw new Error('Error while querying workflow artifacts');
  }
  if (!response.outputs.parameters) {
    throw new Error('Found no artifacts for workflow');
  }
  const results = response.outputs.parameters.filter((entry) => entry.name === artifactName);
  if (results.length !== 1) {
    throw new Error(`Expected 1 artifact with name ${artifactName}, found: ${results.length}`);
  }
  return getPresignedUrl(JSON.parse(results[0].value).did, 'download');
};

// TODO - reuse from ../../GWASApp/Utils/cohortMiddlewareApi.js instead?
export const queryConfig = {
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  retry: false,
};
