/// <reference path="../../../GuppyComponents/typedef.js" />

/** @typedef {{}} EmptyFilterStatus */

/** @typedef {{ [option: string]: boolean }} OptionFilterStatus */

/** @typedef {[lowerBound: number, upperBound: number]} RangeFilterStatus */

/** @typedef {EmptyFilterStatus | OptionFilterStatus | RangeFilterStatus} FilterSectionStatus */

/** @typedef {FilterSectionStatus[]} FilterTabStatus */

/** @typedef {{ [anchorLabel: string]: FilterTabStatus }} AnchoredFilterTabStatus */

/** @typedef {(FilterTabStatus | AnchoredFilterTabStatus)[]} FilterStatus */

/**
 * @typedef {Object} SingleSelectFilterOption
 * @property {'singleSelect'} filterType
 * @property {string} text
 * @property {number} count
 * @property {boolean} accessible
 * @property {boolean} disabled
 */

/**
 * @typedef {Object} RangeFilterOption
 * @property {'range'} filterType
 * @property {string} text
 * @property {number} count
 * @property {number} max
 * @property {number} min
 * @property {number} rangeStep
 */

/**
 * @typedef {Object} FilterSectionConfig
 * @property {boolean} isArrayField
 * @property {boolean} isSearchFilter
 * @property {(searchString: string, offset: number) => void} onSearchFilterLoadOptions
 * @property {(SingleSelectFilterOption[] | RangeFilterOption[])} options
 * @property {string} title
 * @property {string} tooltip
 */
