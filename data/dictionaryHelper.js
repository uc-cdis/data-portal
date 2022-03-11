const fs = require('fs');

/**
 * Little helper script just accumulates the .json
 * files in a data/config directory into an object keyed
 * on the file basename with .json stripped.
 */
function collectConfigParams() {
  const configDirPath = `${__dirname}/config`;
  const filenames = fs.readdirSync(configDirPath);
  const params = {};
  for (const filename of filenames)
    if (filename.endsWith('.json')) {
      const key = filename.substring(0, filename.length - 5); // strip .json
      const valueStr = fs.readFileSync(`${configDirPath}/${filename}`, 'utf8');
      params[key] = JSON.parse(valueStr);
    }

  return params;
}

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
  collectConfigParams,
  getGqlSetupFromDictionary,
  getCountsAndDetailsToQuery,
  getAppConfigParamByKey,
  getGqlSetupFromConfigParams,
};
