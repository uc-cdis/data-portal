/**
 * Extract gqlSetup object from a dictionary data
 * sourced from https://domain/api/v0/submission/_dictionary/_all
 * @param {Object} dict
 * @return gqlSetup object used by data/getGqlHelper.js
 */
function getGqlSetupFromDictionary(dict) {
  const fileTypeList = /** @type {string[]} */ ([]);
  for (const [key, entry] of Object.entries(dict))
    if (typeof entry === 'object' && entry.category === 'data_file')
      fileTypeList.push(key);

  return { fileTypeList };
}

function getAppConfigParamByKey(params, key) {
  let app = 'default';
  if (
    process.env.APP &&
    Object.keys(params).includes(process.env.APP) &&
    Object.keys(params[process.env.APP]).includes(key)
  ) {
    app = process.env.APP;
  }
  return params[app][key];
}

function getCountsAndDetailsToQuery(params) {
  const graphqlParam = getAppConfigParamByKey(params, 'graphql');
  const { boardCounts, chartCounts, projectDetails } = graphqlParam;

  return {
    boardCounts,
    chartCounts,
    projectDetails:
      typeof projectDetails === 'string'
        ? graphqlParam[projectDetails]
        : graphqlParam.projectDetails,
  };
}

function getGqlSetupFromConfigParams(params) {
  const { boardCounts, chartCounts, projectDetails } =
    getCountsAndDetailsToQuery(params);
  return {
    boardCounts: boardCounts.map((item) => item.graphql),
    chartCounts: chartCounts.map((item) => item.graphql),
    projectDetails: projectDetails.map((item) => item.graphql),
  };
}

module.exports = {
  getGqlSetupFromDictionary,
  getCountsAndDetailsToQuery,
  getAppConfigParamByKey,
  getGqlSetupFromConfigParams,
};
