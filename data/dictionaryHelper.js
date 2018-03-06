/**
 * Extract gqlSetup object from a dictionary
 * @param {Object} dict from dictionary.json or whatever: https://domain/api/v0/submission/_dictionary/_all
 * @return {experimentType, fileTypeList} gqlSetup object used by data/gqlSetup.js
 */
function dictToGQLSetup(dict) {
  const fileTypeList = Object.keys(dict).filter(key => typeof dict[key] === 'object' && dict[key].category === 'data_file');
  // admin types that link to the 'project' level and are not project or program
  const adminTypeList = Object.keys(dict).filter(
    (key) => {
      const entry = dict[key];
      return key !== 'program' && key !== 'project' && typeof entry === 'object' && entry.category === 'administrative'
        && Array.isArray(entry.links) && entry.links.length > 0;
    },
  ).map(
    (key) => {
      const entry = dict[key];
      return {
        typeName: key,
        entry,
        projectLink: entry.links.find(link => link.target_type === 'project' && link.required),
      };
    },
  );

  const experimentType = ['experiment', 'study', 'trio'].find(
    name => Object.prototype.hasOwnProperty.call(dict, name),
  );

  return {
    fileTypeList,
    adminTypeList,
    experimentType,
  };
}

function paramByApp(params) {
  let app = 'default';
  if (process.env.APP && Object.keys(params).includes(process.env.APP)) {
    app = process.env.APP;
  }
  const paramApp = params[app];
  const boardCounts = paramApp.boardCounts;
  const chartCounts = paramApp.chartCounts;
  let projectDetails = paramApp.projectDetails;
  if (typeof projectDetails === 'string') {
    projectDetails = paramApp[projectDetails];
  }
  return {
    boardCounts,
    chartCounts,
    projectDetails,
  };
}

function paramToGQLSetup(params) {
  const countsAndDetails = paramByApp(params);
  return {
    boardCounts: countsAndDetails.boardCounts.map(item => item.graphql),
    chartCounts: countsAndDetails.chartCounts.map(item => item.graphql),
    projectDetails: countsAndDetails.projectDetails.map(item => item.graphql),
  };
}

module.exports = {
  dictToGQLSetup,
  paramByApp,
  paramToGQLSetup,
};
