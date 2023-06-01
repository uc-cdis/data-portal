import { headers } from '../../../configs';
import { gwasWorkflowPath } from '../../../localconf';
import { getPresignedUrl } from '../../AnalysisJob';

export const getWorkflowDetails = async (
  workflowName,
  workflowUid,
) => {
  // query argo-wrapper endpoint to get the list of artifacts produced by the workflow:
  const endPoint = `${gwasWorkflowPath}status/${workflowName}?uid=${workflowUid}`;
  const response = await fetch(endPoint, { headers })
    .then((res) => res.json())
    .then((data) => data);
  if (!response) {
    const message = 'An error has occured while fetching workflow details';
    throw new Error(message);
  }
  return response;
};

const getDataFromUrl = async (
  url,
) => {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
};

export const fetchPresignedUrlForWorkflowArtifact = async (
  workflowName,
  workflowUid,
  artifactName,
) => {
  // query argo-wrapper endpoint to get the list of artifacts produced by the workflow:
  const response = await getWorkflowDetails(workflowName, workflowUid);
  if (!response) {
    throw new Error('Error while querying workflow artifacts');
  }
  if (!response.outputs.parameters) {
    throw new Error('Found no artifacts for workflow');
  }
  // filter the list to find the artifact matching the given name:
  const results = response.outputs.parameters.filter((entry) => entry.name === artifactName);
  if (results.length !== 1) {
    throw new Error(`Expected 1 artifact with name ${artifactName}, found: ${results.length}`);
  }
  // return a pre-signed "download ready" URL to the artifact:
  return getPresignedUrl(JSON.parse(results[0].value).did, 'download');
};

export const getDataForWorkflowArtifact = async (
  workflowName,
  workflowUid,
  artifactName,
) => {
  const url = await fetchPresignedUrlForWorkflowArtifact(workflowName,
    workflowUid,
    artifactName);
  const result = await getDataFromUrl(url);
  return result;
};

export const queryConfig = {
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  retry: false,
};
