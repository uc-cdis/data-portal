import { FILE_DELIMITERS } from './const';

const papaparse = require('papaparse');
const flatten = require('flat');

/**
 * Flattens a deep nested JSON object skipping
 * the first level to avoid potentially flattening
 * non-nested data.
 * @param {JSON} json
 */
export async function flattenJson(json) {
  const flattenedJson = [];
  Object.keys(json).forEach((key) => {
    flattenedJson.push(flatten(json[key], { delimiter: '_' }));
  });
  return flattenedJson;
}

/**
 * Converts JSON based on a config.
 * @param {JSON} json
 * @param {Object} config
 */
export async function conversion(json, config) {
  return papaparse.unparse(json, config);
}

/**
 * Converts JSON to a specified file format.
 * Defaultes to JSON if file format is not supported.
 * @param {JSON} json
 * @param {string} format
 */
export async function jsonToFormat(json, format) {
  if (format in FILE_DELIMITERS) {
    const flatJson = await flattenJson(json);
    const data = await conversion(flatJson, { delimiter: FILE_DELIMITERS[format] });
    return data;
  }
  return json;
}
