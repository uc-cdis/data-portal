/**
 * @typedef {object} OptionFilterItem
 * @property {string[]} selectedValues
 * @property {never} lowerBound
 * @property {never} upperBound
 */

/**
 * @typedef {object} RangeFilterItem
 * @property {number} lowerBound
 * @property {number} upperBound
 * @property {never} selectedValues
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
 * @property {?number} [id]
 */

/**
 * @typedef {'open' | 'save' | 'update' | 'delete'} ExplorerCohortActionType
 */
