// Functions for checking user's auth mapping

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

export const userHasDataUpload = (userAuthMapping) => {
    //data_upload policy is resource data_file, method file_upload, service fence
    const actionIsFileUpload = x => { return x['method'] === 'file_upload' && x['service'] === 'fence' }
    var resource = userAuthMapping['/data_file']
    return resource !== undefined && resource.some(actionIsFileUpload)
}


export const userHasDeleteOnProject = (projectID, userAuthMapping) => {
    var resourcePath = resourcePathFromProjectID(projectID)
    var actions = userAuthMapping[resourcePath]

    return actions !== undefined && actions.some(x => x["method"] === "delete")
}


export const userHasCreateOnProject = (projectID, userAuthMapping) => {
    var resourcePath = resourcePathFromProjectID(projectID)
    var actions = userAuthMapping[resourcePath]

    return actions !== undefined && actions.some(x => x["method"] === "create")
}


export const userHasCreateOrUpdateOnProject = (projectID, userAuthMapping) => {
    const actionHasCreateOrUpdate = x => { return x['method'] === 'create' || x['method'] === 'update' }

    var resourcePath = resourcePathFromProjectID(projectID)
    var resource = userAuthMapping[resourcePath]

    return resource !== undefined && resource.some(actionHasCreateOrUpdate)
}


export const userHasCreateOnAnyProject = (userAuthMapping) => {
    const actionHasCreate = x => { return (x["method"] === "create") }
    //array of arrays of { service: x, method: y }
    var actionArrays = Object.values(userAuthMapping)
    var hasCreate = actionArrays.some(x => { return x.some(actionHasCreate) })
    return hasCreate
}


export const userHasCreateOrUpdateOnAnyProject = (userAuthMapping) => {
    const actionHasCreateOrUpdate = x => {
      return (x["method"] === "create" || x["method"] === "update")
    }
    //array of arrays of { service: x, method: y }
    var actionArrays = Object.values(userAuthMapping)
    var hasCreateOrUpdate = actionArrays.some(x => { return x.some(actionHasCreateOrUpdate) })
    return hasCreateOrUpdate
}
