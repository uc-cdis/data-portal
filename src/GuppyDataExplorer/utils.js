import './typedef';

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
 * @param {boolean} isAnchorFilterEnabled
 */
export function validateFilter(value, filterConfig, isAnchorFilterEnabled) {
  if (!isPlainObject(value)) return false;

  const allFields = filterConfig.tabs.flatMap(({ fields }) => fields);
  const testFieldSet = new Set(allFields);
  for (const [field, filterContent] of Object.entries(value)) {
    if (isAnchorFilterEnabled && 'filter' in filterContent)
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
