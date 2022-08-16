export const ENUM_ACCESSIBILITY = {
  ACCESSIBLE: 'accessible',
  UNACCESSIBLE: 'unaccessible',
  ALL: 'all',
};

export const FILE_FORMATS = {
  JSON: 'json',
  TSV: 'tsv',
  CSV: 'csv',
};

export const FILE_DELIMITERS = {
  tsv: '\t',
  csv: ',',
};

export const FILTER_TYPE = {
  /** @type {'ANCHORED'} */
  ANCHORED: 'ANCHORED',
  /** @type {'OPTION'} */
  OPTION: 'OPTION',
  /** @type {'RANGE'} */
  RANGE: 'RANGE',
  /** @type {'STANDARD'} */
  STANDARD: 'STANDARD',
  /** @type {'COMPOSED'} */
  COMPOSED: 'COMPOSED',
};

export { guppyUrl as GUPPY_URL } from '../../localconf';
