const fs = require('fs');


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

  const experimentType = ['experiment', 'study', 'trio'].find(name => Object.prototype.hasOwnProperty.call(dict, name));

  return {
    fileTypeList,
    adminTypeList,
    experimentType,
    hasCaseType: Object.prototype.hasOwnProperty.call(dict, 'case'),
    hasCoreVisit: Object.prototype.hasOwnProperty.call(dict, 'core_visit'),
    hasAliquotType: Object.prototype.hasOwnProperty.call(dict, 'aliquot'),
    hasSummaryLabResult: Object.prototype.hasOwnProperty.call(dict, 'summary_lab_result'),
    hasSummarySocioDemographic: Object.prototype.hasOwnProperty.call(dict, 'summary_socio_demographic'),
  };
}


/**
 * Little helper for loading a json file
 * @param {string} path
 * @return {status, data, error} parsed json in data - or {} if path does not exist or is not json 
 */
function loadJsonFile(path) {
  try {
    const content = fs.readFileSync(path);
    return { status: 'ok', data: JSON.parse(content) };
  } catch (err) {
    // console.error( "Failed to load: " + path, err );
    return { status: 'error', error: err };
  }
}

module.exports = {
  dictToGQLSetup,
  loadJsonFile,
};
