/**
 * @typedef {object} OptionFilterItem
 * @property {string[]} selectedValues
 */

/**
 * @typedef {object} RangeFilterItem
 * @property {number} lowerBound
 * @property {number} upperBound
 */

/**
 * @typedef {OptionFilterItem | RangeFilterItem} ExplorerFilterItem
 */

/**
 * @typedef {{[x: string]: ExplorerFilterItem}} ExplorerFilter
 */

/**
 * @typedef {object} ExplorerCohort
 * @property {string} name
 * @property {string} description
 * @property {ExplorerFilter} filter
 */
