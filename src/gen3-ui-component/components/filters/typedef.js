/// <reference path="../../../GuppyComponents/typedef.js" />

/** @typedef {{ [option: string]: boolean }} OptionFilterStatus */

/** @typedef {[lowerBound: number, upperBound: number]} RangeFilterStatus */

/** @typedef {OptionFilterStatus | RangeFilterStatus} FilterSectionStatus */

/** @typedef {FilterSectionStatus[]} FilterTabStatus */

/** @typedef {{ [anchorLabel: string]: FilterTabStatus }} AnchoredFilterTabStatus */

/** @typedef {(FilterTabStatus | AnchoredFilterTabStatus)[]} FilterStatus */

/**
 * @typedef {Object} AnchorConfig
 * @property {string} fieldName
 * @property {string[]} options
 * @property {string[]} tabs
 */
