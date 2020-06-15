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


// Used by ProjectSubmission to determine whether the user is creating a program.
// To create a program the user needs access to the resource
// /services/sheepdog/submission/program, usually granted via Sheepdog admin policy.
export const isRootUrl = urlFragment => urlFragment === '_root';


// Used by ProjectSubmission to determine whether the user is creating a project.
// To create a project the user needs access to the resource
// /services/sheepdog/submission/project, usually granted via Sheepdog admin policy.
// A dash delimits the project code if there is one
export const isProgramUrl = urlFragment => urlFragment !== '_root' && !urlFragment.includes('-');


export const userHasSheepdogProgramAdmin = (userAuthMapping = {}) =>
  userAuthMapping['/services/sheepdog/submission/program'] !== undefined;


export const userHasSheepdogProjectAdmin = (userAuthMapping = {}) =>
  userAuthMapping['/services/sheepdog/submission/project'] !== undefined;


export const projectCodeFromResourcePath = (resourcePath) => {
  // If resourcePath is anything other than /programs/foo/projects/bar[/morestuff],
  // e.g. /gen3/programs/foo/projects/bar or /workspace or /programs/foo/bar/projects/baz,
  // this will just return ''
  // because concept of projectID/project code for peregrine/sheepdog incompatible with those cases.
  // Otherwise, returns project code (not project ID i.e. name-code!).
  const split = resourcePath.split('/');
  return (split.length < 5 || split[1] !== 'programs' || split[3] !== 'projects') ? '' : split[4];
};


export const listifyMethodsFromMapping = (actions) => {
  // actions is an array of objects { 'service': x, 'method': y }
  const reducer = (accumulator, currval) => accumulator.concat([currval.method]);
  return actions.reduce(reducer, []);
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

export const userHasCreateOrUpdateMethodOnProject = (project, userAuthMapping) => (
  userHasMethodOnProject('create', project, userAuthMapping)
    || userHasMethodOnProject('update', project, userAuthMapping)
);

export const shouldDisplayProjectUIComponents = (project, userAuthMapping, useArboristUI) => (
  !useArboristUI
    || (isRootUrl(project) && userHasSheepdogProgramAdmin(userAuthMapping))
    || (isProgramUrl(project) && userHasSheepdogProjectAdmin(userAuthMapping))
    || userHasCreateOrUpdateMethodOnProject(project, userAuthMapping)
    || userHasMethodOnProject('read', project, userAuthMapping)
);
