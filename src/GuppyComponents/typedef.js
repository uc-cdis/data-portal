/**
 * @typedef {Object} OptionFilter
 * @property {string[]} selectedValues
 * @property {'AND' | 'OR'} [__combineMode]
 */

/**
 * @typedef {Object} RangeFilter
 * @property {number} lowerBound
 * @property {number} upperBound
 */

/**
 * @typedef {{ [x: string]: OptionFilter | RangeFilter }} FilterState
 */

/**
 * @typedef {Object} GqlInFilter
 * @property {{ [x: string]: string[] }} IN
 */

/**
 * @typedef {Object} GqlRangeFilter
 * @property {{ [x: string]: number }} [GTE]
 * @property {{ [x: string]: number }} [LTE]
 */

/**
 * @typedef {Object} GqlSimpleAndFilter
 * @property {(GqlInFilter | GqlRangeFilter | GqlSimpleAndFilter)[]} AND
 */

/**
 * @typedef {Object} GqlNestedFilter
 * @property {Object} nested
 * @property {string} nested.path
 * @property {(GqlInFilter | GqlSimpleAndFilter)[]} nested.AND
 */

/**
 * @typedef {Object} GqlAndFilter
 * @property {(GqlInFilter | GqlRangeFilter | GqlSimpleAndFilter | GqlNestedFilter)[]} AND
 */

/**
 * @typedef {GqlAndFilter | GqlInFilter | GqlRangeFilter | GqlNestedFilter} GqlFilter
 */
