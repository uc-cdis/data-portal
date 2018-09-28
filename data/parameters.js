const fs = require('fs');


/**
 * Little helper script just accumulates the .json
 * files in a given directory into an object keyed
 * on the file basename with .json stripped.
 */
function scanJsonDir(dirPath) {
  return fs.readdirSync(dirPath)
    .filter(name => name.endsWith('.json'))
    .map(
      (jsonName) => {
        const key = jsonName.substring(0, jsonName.length - 5); // strip .json
        const valueStr = fs.readFileSync(`${dirPath}/${jsonName}`, 'utf8');
        return { key, value: JSON.parse(valueStr) };
      },
    )
    .reduce(
      (acc, it) => {
        acc[it.key] = it.value;
        return acc;
      }, {},
    );
}

const params = scanJsonDir(`${__dirname}/config`);

module.exports = {
  params,
};
