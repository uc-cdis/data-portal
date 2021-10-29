/// <reference path="../GuppyComponents/typedef.js" />

/**
 * @typedef {Object} SingleChartConfig
 * @property {string} chartType
 * @property {string} title
 * @property {boolean} [showPercentage]
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
 * @property {DropdownsConfig} [dropdowns]
 * @property {string} [terraExportURL]
 * @property {string[]} [terraTemplate]
 * @property {string} [sevenBridgesExportURL]
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
 * @property {{ [x: string]: OptionFilter; }} [adminAppliedPreFilters]
 * @property {SingleButtonConfig[]} buttons
 * @property {ChartConfig} charts
 * @property {DropdownsConfig} [dropdowns]
 * @property {FilterConfig} filters
 * @property {string} [getAccessButtonLink]
 * @property {GuppyConfig} guppyConfig
 * @property {boolean} [hideGetAccessButton]
 * @property {number} id
 * @property {string} [label]
 * @property {PatientIdsConfig} [patientIds]
 * @property {string} [sevenBridgesExportURL]
 * @property {SurvivalAnalysisConfig} survivalAnalysis
 * @property {TableConfig} table
 * @property {string} [terraExportURL]
 * @property {string[]} [terraTemplate]
 */

/**
 * @typedef {Object} AlteredExplorerConfig
 * @property {{ [x:string]: OptionFilter }} [adminAppliedPreFilters]
 * @property {ButtonConfig} buttonConfig
 * @property {ChartConfig} chartConfig
 * @property {FilterConfig} filterConfig
 * @property {string} [getAccessButtonLink]
 * @property {GuppyConfig} guppyConfig
 * @property {boolean} [hideGetAccessButton]
 * @property {PatientIdsConfig} [patientIdsConfig]
 * @property {SurvivalAnalysisConfig} survivalAnalysisConfig
 * @property {TableConfig} tableConfig
 * @property {number} tierAccessLimit
 */
