/// <reference path="../typedef.js" />

/**
 * @typedef {Object} RisktableDataPoint
 * @property {number} nrisk
 * @property {number} time
 */

/**
 * @typedef {Object} RisktableData
 * @property {RisktableDataPoint[]} data
 * @property {string} name
 */

/**
 * @typedef {Object} SurvivalDataPoint
 * @property {number} prob
 * @property {number} time
 */

/**
 * @typedef {Object} SurvivalData
 * @property {SurvivalDataPoint[]} data
 * @property {string} name
 */

/**
 * @typedef {Object} SurvivalResultForFilterSet
 * @property {string} name
 * @property {RisktableDataPoint[]} risktable
 * @property {SurvivalDataPoint[]} survival
 */

/** @typedef {{ [id: string]: SurvivalResultForFilterSet }} SurvivalAnalysisResult */

/**
 * @typedef {Object} UserInput
 * @property {number} timeInterval
 * @property {number} startTime
 * @property {number} endTime
 * @property {boolean} efsFlag
 * @property {ExplorerFilterSet[]} usedFilterSets
 */

/**
 * @callback UserInputSubmitHandler
 * @param {UserInput} userInput
 * @returns {void}
 */

/**
 * @typedef {Object} FactorItem
 * @property {string} label
 * @property {string} value
 */

/**
 * @typedef {{ [key: string]: string }} ColorScheme
 */
