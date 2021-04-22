import { FILE_DELIMITERS } from './const';
import papaparse from 'papaparse';
import flat from 'flat';

/**
 * Flattens a deep nested JSON object skipping
 * the first level to avoid potentially flattening
 * non-nested data.
 * @param {JSON} json
 */
export function flattenJson(json) {
  const flattenedJson = [];
  Object.keys(json).forEach((key) => {
    flattenedJson.push(flat(json[key], { delimiter: '_' }));
  });
  return flattenedJson;
}

/**
 * Converts JSON based on a config.
 * @param {JSON} json
 * @param {Object} config
 */
export function conversion(json, config) {
  return papaparse.unparse(json, config);
}

/**
 * Converts JSON to a specified file format.
 * Defaultes to JSON if file format is not supported.
 * @param {JSON} json
 * @param {string} format
 */
export function jsonToFormat(json, format) {
  if (format in FILE_DELIMITERS) {
    const flatJson = flattenJson(json);
    const data = conversion(flatJson, {
      delimiter: FILE_DELIMITERS[format],
    });
    return data;
  }
  return json;
}
