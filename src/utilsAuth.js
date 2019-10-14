// Functions for checking user's auth mapping.
// These should only be called if config useArboristUI is true (-> userAuthMapping is defined).

const resourcePathFromProjectID = (projectID) => {
    // Assumes: projectID looks like program_name-project_code
    // Assumes: Project codes can have dashes; program names cannot.
    // Assumes: All resource paths are /programs/blah/projects/blah[/morestuff]
    var split = projectID.split('-');
    var program = split[0]
    var project = split.slice(1).join('-')
    var resourcePath = ["/programs", program, "projects", project].join('/')
    return resourcePath
}


export const userHasDataUpload = (userAuthMapping = {}) => {
    //data_upload policy is resource data_file, method file_upload, service fence
    const actionIsFileUpload = x => { return x['method'] === 'file_upload' && x['service'] === 'fence' }
    var resource = userAuthMapping['/data_file']
    return resource !== undefined && resource.some(actionIsFileUpload)
}


export const userHasMethodOnProject = (method, projectID, userAuthMapping = {}) => {
    // method should be a string e.g. 'create'
    var resourcePath = resourcePathFromProjectID(projectID)
    var actions = userAuthMapping[resourcePath]
    return actions !== undefined && actions.some(x => x['method'] === method)
}


export const userHasMethodOnAnyProject = (method, userAuthMapping = {}) => {
    // method should be a string e.g. 'create'
    const actionHasMethod = x => { return (x['method'] === method) }
    //actionArrays is array of arrays of { service: x, method: y }
    var actionArrays = Object.values(userAuthMapping)
    var hasMethod = actionArrays.some(x => { return x.some(actionHasMethod) })
    return hasMethod
}
