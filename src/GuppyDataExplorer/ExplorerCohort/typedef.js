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
 * @typedef {{[x: string]: ExplorerFilterItem}} ExplorerFilters
 */

/**
 * @typedef {object} ExplorerCohort
 * @property {string} name
 * @property {string} description
 * @property {ExplorerFilters} filters
 */

/**
 * @typedef {'open' | 'save' | 'update' | 'delete'} ExplorerCohortActionType
 */
