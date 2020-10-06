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
 * @typedef {Object} UserInput
 * @property {string} factorVariable
 * @property {string} stratificationVariable
 * @property {number} timeInterval
 * @property {number} startTime
 * @property {number} endTime
 * @property {boolean} efsFlag
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
