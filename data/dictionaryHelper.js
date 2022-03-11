const fs = require('fs');

/** @typedef {{ [name: string]: Object }} ConfigParams */
/** @typedef {Object} Dictionary */
/** @typedef {{ [x: string]: string }} CountInfo */

/**
 * @param {ConfigParams} params
 * @param {string} key
 */
function getAppConfigParamByKey(params, key) {
  const app =
    process.env.APP &&
    Object.keys(params).includes(process.env.APP) &&
    Object.keys(params[process.env.APP]).includes(key)
      ? process.env.APP
      : 'default';

  return params[app][key];
}

/** @param {ConfigParams} */
function getCountsAndDetailsToQuery(params) {
  const graphqlParam = getAppConfigParamByKey(params, 'graphql');
  const { boardCounts, chartCounts, projectDetails } = graphqlParam;

  return /** @type {{ [x: string]: CountInfo[] }} */ ({
    boardCounts,
    chartCounts,
    projectDetails:
      typeof projectDetails === 'string'
        ? graphqlParam[projectDetails]
        : graphqlParam.projectDetails,
  });
}

/** @param {ConfigParams} */
function getGqlSetupFromConfigParams(params) {
  const { boardCounts, chartCounts, projectDetails } =
    getCountsAndDetailsToQuery(params);
  return {
    boardCounts: boardCounts.map((item) => item.graphql),
    chartCounts: chartCounts.map((item) => item.graphql),
    projectDetails: projectDetails.map((item) => item.graphql),
  };
}

/**
 * Extract gqlSetup object from a dictionary data
 * sourced from https://domain/api/v0/submission/_dictionary/_all
 * @param {Dictionary} dictionary
 * @return gqlSetup object used by data/getGqlHelper.js
 */
function getGqlSetupFromDictionary(dictionary) {
  const fileTypeList = /** @type {string[]} */ ([]);
  for (const [key, entry] of Object.entries(dictionary))
    if (typeof entry === 'object' && entry.category === 'data_file')
      fileTypeList.push(key);

  return { fileTypeList };
}

/**
 * Little helper script just accumulates the .json
 * files in a data/config directory into an object keyed
 * on the file basename with .json stripped.
 * @returns {ConfigParams}
 */
function loadConfigParams() {
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

/** @returns {Dictionary} */
function loadDictionary() {
  const dictionaryPath = `${__dirname}/dictionary.json`;
  const dictionaryString = fs.readFileSync(dictionaryPath, 'utf8');
  return JSON.parse(dictionaryString);
}

module.exports = {
  getAppConfigParamByKey,
  getCountsAndDetailsToQuery,
  getGqlSetupFromConfigParams,
  getGqlSetupFromDictionary,
  loadConfigParams,
  loadDictionary,
};
