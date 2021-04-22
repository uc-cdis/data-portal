import { FILE_DELIMITERS } from './const';
import papaparse from 'papaparse';
import flat from 'flat';

/**
 * Converts JSON to a specified file format.
 * Defaultes to JSON if file format is not supported.
 * @param {Object} json
 * @param {string} format
 */
export function jsonToFormat(json, format) {
  if (format in FILE_DELIMITERS) {
    const flatJson = Object.keys(json).map((key) =>
      flat(json[key], { delimiter: '_' })
    );
    return papaparse.unparse(flatJson, {
      delimiter: FILE_DELIMITERS[format],
    });
  }
  return json;
}
