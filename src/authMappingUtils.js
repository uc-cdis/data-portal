// Functions for checking user's auth mapping.
// These should only be called if config useArboristUI is true (-> userAuthMapping is defined).

const resourcePathFromProjectID = (projectID) => {
  // Assumes: projectID looks like program_name-project_code
  // Assumes: Project codes can have dashes; program names cannot.
  // Assumes: All resource paths are /programs/blah/projects/blah[/morestuff]
  const split = projectID.split('-');
  const program = split[0];
  const project = split.slice(1).join('-');
  const resourcePath = ['/programs', program, 'projects', project].join('/');
  return resourcePath;
};


export const userHasDataUpload = (userAuthMapping = {}) => {
  // data_upload policy is resource data_file, method file_upload, service fence
  const actionIsFileUpload = x => x.method === 'file_upload' && x.service === 'fence';
  const resource = userAuthMapping['/data_file'];
  return resource !== undefined && resource.some(actionIsFileUpload);
};


export const userHasMethodOnProject = (method, projectID, userAuthMapping = {}) => {
  // method should be a string e.g. 'create'
  const resourcePath = resourcePathFromProjectID(projectID);
  const actions = userAuthMapping[resourcePath];
  return actions !== undefined && actions.some(x => x.method === method);
};


export const userHasMethodOnAnyProject = (method, userAuthMapping = {}) => {
  // method should be a string e.g. 'create'
  const actionHasMethod = x => (x.method === method);
  // actionArrays is array of arrays of { service: x, method: y }
  const actionArrays = Object.values(userAuthMapping);
  const hasMethod = actionArrays.some(x => x.some(actionHasMethod));
  return hasMethod;
};
