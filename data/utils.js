const fs = require('fs');

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
  loadJsonFile,
};
