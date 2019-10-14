// Functions for checking user's auth mapping

export const userHasDataUpload = (userAuthMapping) => {
    //data_upload policy is resource data_file, method file_upload, service fence
    const actionIsFileUpload = x => { return x['method'] === 'file_upload' && x['service'] === 'fence' }
    var resource = userAuthMapping['/data_file']
    return resource !== undefined && resource.some(actionIsFileUpload)
}


export const userHasDeleteOnProject = (projectName, userAuthMapping) => {
    var split = projectName.split('-');
    var program = split[0]
    var project = split.slice(1).join('-')
    var resourcePath = ["/programs", program, "projects", project].join('/')
    var actions = userAuthMapping[resourcePath]

    return actions !== undefined && actions.some(x => x["method"] === "delete")
}


export const userHasCreateOnProject = (projectName, userAuthMapping) => {
    var split = projectName.split('-');
    var program = split[0]
    var project = split.slice(1).join('-')
    var resource = ["/programs", program, "projects", project].join('/')
    var actions = userAuthMapping[resource]

    return actions !== undefined && actions.some(x => x["method"] === "create")
}


export const userHasCreateOrUpdateOnProject = (projectName, userAuthMapping) => {
    const actionHasCreateOrUpdate = x => { return x['method'] === 'create' || x['method'] === 'update' }

    var split = projectName.split('-');
    var program = split[0]
    var project = split.slice(1).join('-')
    var resourcePath = ["/programs", program, "projects", project].join('/')

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
