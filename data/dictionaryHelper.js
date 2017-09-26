const fs = require('fs');


/**
 * Extract gqlSetup object from a dictionary
 * @param {Object} dict from dictionary.json or whatever: https://domain/api/v0/submission/_dictionary/_all
 * @return {experimentType, fileTypeList} gqlSetup object used by data/gqlSetup.js
 */
function dictToGQLSetup( dict ) {
  const fileTypes = Object.keys( dict ).filter( key => typeof dict[key] === "object" && dict[ key ].category === "data_file" );
  const experimentType = dict.hasOwnProperty( "experiment" ) ? "experiment" : "study";

  return {
    fileTypeList: fileTypes,
    experimentType: experimentType
  };
}


/**
 * Little helper for loading a json file
 * @param {string} path
 * @return {status, data, error} parsed json in data - or {} if path does not exist or is not json 
 */
function loadJsonFile( path ) {
  try {
    const content = fs.readFileSync( path );
    return { status: "ok", data: JSON.parse( content ) };
  } catch (err) {
    //console.error( "Failed to load: " + path, err );
    return { status: "error", error: err };
  }
}

module.exports = exports = {
  dictToGQLSetup: dictToGQLSetup,
  loadJsonFile: loadJsonFile 
};