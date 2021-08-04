/// <reference path="../GuppyComponents/typedef.js" />

/**
 * @typedef {'bar' | 'count' | 'pie' | 'stackedBar'} ChartType
 */

/**
 * @typedef {Object} SingleChartConfig
 * @property {ChartType} chartType
 * @property {string} title
 */

/**
 * @typedef {{ [x: string]: SingleChartConfig}} ChartConfig
 */

/**
 * @typedef {Object} SingleButtonConfig
 * @property {boolean} enabled
 * @property {string} type
 * @property {string} title
 * @property {string} [leftIcon]
 * @property {string} [rightIcon]
 * @property {string} [fileName]
 * @property {string} [dropdownId]
 * @property {string} [tooltipText]
 */

/**
 * @typedef {{ [x: string]: { title: string }}} DropdownsConfig
 */

/**
 * @typedef {Object} ButtonConfig
 * @property {SingleButtonConfig[]} buttons
 * @property {DropdownsConfig} dropdowns
 * @property {string} terraExportURL
 * @property {string[]} terraTemplate
 * @property {string} sevenBridgesExportURL
 */

/**
 * @typedef {Object} TableConfig
 * @property {boolean} enabled
 * @property {string[]} [fields]
 * @property {string[]} [linkFields]
 */

/**
 * @typedef {Object} PatientIdsConfig
 * @property {boolean} [filter]
 * @property {boolean} [export]
 */

/**
 * @typedef {Object} SurvivalAnalysisConfig
 * @property {Object} [result]
 * @property {boolean} [result.pval]
 * @property {boolean} [result.risktable]
 * @property {boolean} [result.survival]
 */

/**
 * @typedef {Object} SingleExplorerConfig
 * @property {{ [x: string]: OptionFilter; }} adminAppliedPreFilters
 * @property {SingleButtonConfig[]} buttons
 * @property {ChartConfig} charts
 * @property {DropdownsConfig} dropdowns
 * @property {GuppyConfig} guppyConfig
 * @property {FilterConfig} filters
 * @property {PatientIdsConfig} patientIds
 * @property {SurvivalAnalysisConfig} survivalAnalysis
 * @property {TableConfig} table
 * @property {string} tabTitle
 * @property {string} projectId
 * @property {string} graphqlFitled
 * @property {string} index
 * @property {string} getAccessButtonLink
 * @property {boolean} hideGetAccessButton
 * @property {string} terraExportURL
 * @property {string[]} terraTemplate
 * @property {string} sevenBridgesExportURL
 */
