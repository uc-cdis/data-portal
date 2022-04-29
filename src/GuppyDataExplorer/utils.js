/** @typedef {import('./types').ButtonConfig} ButtonConfig */
/** @typedef {import('./types').ExplorerFilter} ExplorerFilter */
/** @typedef {import('./types').FilterConfig} FilterConfig */
/** @typedef {import('./types').GuppyConfig} GuppyConfig */
/** @typedef {import('./types').PatientIdsConfig} PatientIdsConfig */
/** @typedef {import('./types').SingleButtonConfig} SingleButtonConfig */
/** @typedef {import('./types').SurvivalAnalysisConfig} SurvivalAnalysisConfig */

import { capitalizeFirstLetter } from '../utils';

/**
 * Buttons are grouped by their dropdownId value.
 * This function calculates and groups buttons under the same dropdown,
 * and return a map of dropdown ID and related infos for that dropdown:
 *   cnt: how many buttons under this dropdown
 *   dropdownConfig: infos for this dropdown, e.g. "title"
 *   buttonConfigs: a list of button configs (includes buttion title, button type, etc.)
 * @param {ButtonConfig} config
 */
export const calculateDropdownButtonConfigs = (config) => {
  /**
   * @typedef {Object} SingleDropdownButtonConfig
   * @property {number} cnt
   * @property {{ title: string }} dropdownConfig
   * @property {SingleButtonConfig[]} buttonConfigs
   */

  /** @type {false | { [x: string]: SingleDropdownButtonConfig }} */
  const dropdownConfig =
    config &&
    config.dropdowns &&
    Object.keys(config.dropdowns).length > 0 &&
    Object.keys(config.dropdowns).reduce((map, dropdownId) => {
      const buttonCount = config.buttons
        .filter((btnCfg) => btnCfg.enabled)
        .filter(
          (btnCfg) => btnCfg.dropdownId && btnCfg.dropdownId === dropdownId
        ).length;
      const drpdnCfg = config.dropdowns[dropdownId];
      const buttonConfigs = config.buttons
        .filter((btnCfg) => btnCfg.enabled)
        .filter(
          (btnCfg) => btnCfg.dropdownId && btnCfg.dropdownId === dropdownId
        );
      const ret = { ...map };
      ret[dropdownId] = {
        cnt: buttonCount,
        dropdownConfig: drpdnCfg,
        buttonConfigs,
      };
      return ret;
    }, {});
  return dropdownConfig;
};

/**
 * Humanize a number
 * @param {number} number - a integer to convert
 * @param {number} fixedPoint - fixzed point position
 * @returns the humanized number
 */
export const humanizeNumber = (number, fixedPoint = 2) => {
  if (number < 1000) {
    return number;
  }
  const unit = {
    1: 'K', // Thousand, 10^3
    2: 'M', // Milliion, 10^6
    3: 'B', // Billion, 10^9
    4: 'T', // Trillion, 10^12
    5: 'Qa', // Quadrillion, 10^15
  };
  for (let i = 5; i >= 1; i -= 1)
    if (number > 1000 ** i)
      return `${(number / 1000 ** i).toFixed(fixedPoint)}${unit[i]}`;

  // 10^15+, number is too large
  return number.toExponential(fixedPoint);
};

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isTextFilter(value) {
  return (
    Object.keys(value).length === 1 &&
    Array.isArray(value?.selectedValues) &&
    value?.selectedValues.length > 0 &&
    typeof value?.selectedValues[0] === 'string'
  );
}

function isRangeFilter(value) {
  return (
    Object.keys(value).length === 2 &&
    typeof value?.lowerBound === 'number' &&
    typeof value?.upperBound === 'number' &&
    value?.lowerBound < value?.upperBound
  );
}

function isValid(filterContent) {
  return (
    isPlainObject(filterContent) &&
    (isTextFilter(filterContent) || isRangeFilter(filterContent))
  );
}

/**
 * Validates the provide filter value based on configuration.
 * Performs the following checks:
 * - filter value is a plain object
 * - filter keys include only fields specified in the configuration
 * @param {*} value
 * @param {FilterConfig} filterConfig
 */
export function validateFilter(value, filterConfig) {
  if (!isPlainObject(value)) return false;

  const allFields = filterConfig.tabs.flatMap(({ fields }) => fields);
  const testFieldSet = new Set(allFields);
  const isAnchorFilterEnabled = filterConfig.anchor !== undefined;
  for (const [field, filterContent] of Object.entries(value)) {
    if (field === '__combineMode') {
      if (!['AND', 'OR'].includes(filterContent)) return false;
    } else if (isAnchorFilterEnabled && 'filter' in filterContent)
      for (const [anchoredField, anchoredfilterContent] of Object.entries(
        filterContent.filter
      ))
        if (isValid(anchoredfilterContent)) testFieldSet.add(anchoredField);
        else return false;
    else if (isValid(filterContent)) testFieldSet.add(field);
    else return false;
  }

  return allFields.length === testFieldSet.size;
}

/**
 * @param {URLSearchParams} searchParams
 * @param {FilterConfig} filterConfig
 * @param {PatientIdsConfig} [patientIdsConfig]
 */
export function extractExplorerStateFromURL(
  searchParams,
  filterConfig,
  patientIdsConfig
) {
  /** @type {ExplorerFilter} */
  let explorerFilter = {};
  if (searchParams.has('filter'))
    try {
      const filterInUrl = JSON.parse(decodeURI(searchParams.get('filter')));
      if (validateFilter(filterInUrl, filterConfig))
        explorerFilter = filterInUrl;
      else throw new Error(undefined);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Invalid filter value in URL.', e);
    }

  // eslint-disable-next-line no-nested-ternary
  const patientIds = patientIdsConfig?.filter
    ? searchParams.has('patientIds')
      ? searchParams.get('patientIds').split(',')
      : []
    : undefined;

  return { explorerFilter, patientIds };
}
/**
 * @param {FilterConfig} filterConfig
 * @param {GuppyConfig['fieldMapping']} [fieldMapping]
 */
export function createFilterInfo(filterConfig, fieldMapping = []) {
  const map = /** @type {FilterConfig['info']} */ ({});

  for (const { field, name, tooltip } of fieldMapping)
    map[field] = { label: name ?? capitalizeFirstLetter(field), tooltip };

  const allFields = filterConfig.tabs.flatMap(({ fields }) => fields);
  if ('anchor' in filterConfig) allFields.push(filterConfig.anchor.field);

  for (const field of allFields)
    if (!(field in map)) map[field] = { label: capitalizeFirstLetter(field) };

  return map;
}

/** @param {SurvivalAnalysisConfig} config */
export function isSurvivalAnalysisEnabled(config) {
  if (config?.result !== undefined)
    for (const option of ['risktable', 'survival'])
      if (config.result[option] !== undefined && config.result[option])
        return true;

  return false;
}
