/**
 * Extract gqlSetup object from a dictionary data
 * sourced from https://domain/api/v0/submission/_dictionary/_all
 * @param {Object} dict
 * @return gqlSetup object used by data/gqlSetup.js
 */
function createGqlSetupFromDictionary(dict) {
  const fileTypeList = Object.keys(dict).filter(
    (key) => typeof dict[key] === 'object' && dict[key].category === 'data_file'
  );
  // admin types that link to the 'project' level and are not project or program
  const adminTypeList = Object.keys(dict)
    .filter((key) => {
      const entry = dict[key];
      return (
        key !== 'program' &&
        key !== 'project' &&
        typeof entry === 'object' &&
        entry.category === 'administrative' &&
        Array.isArray(entry.links) &&
        entry.links.length > 0
      );
    })
    .map((key) => {
      const entry = dict[key];
      return {
        typeName: key,
        entry,
        projectLink: entry.links.find(
          (link) => link.target_type === 'project' && link.required
        ),
      };
    });

  const experimentType = ['experiment', 'study', 'trio'].find((name) =>
    Object.prototype.hasOwnProperty.call(dict, name)
  );

  return {
    fileTypeList,
    adminTypeList,
    experimentType,
  };
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

const { params } = require('./parameters');

function createGqlSetupFromConfigParams() {
  const { boardCounts, chartCounts, projectDetails } =
    getCountsAndDetailsToQuery(params);
  return {
    boardCounts: boardCounts.map((item) => item.graphql),
    chartCounts: chartCounts.map((item) => item.graphql),
    projectDetails: projectDetails.map((item) => item.graphql),
  };
}

module.exports = {
  createGqlSetupFromDictionary,
  getCountsAndDetailsToQuery,
  getAppConfigParamByKey,
  createGqlSetupFromConfigParams,
};
