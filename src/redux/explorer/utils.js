import { explorerConfig } from '../../localconf';
import { capitalizeFirstLetter } from '../../utils';

/** @typedef {import('../../GuppyComponents/types').GuppyConfig} GuppyConfig */
/** @typedef {import('../../GuppyComponents/types').FilterConfig} FilterConfig */
/** @typedef {import('../../GuppyDataExplorer/types').ExplorerFilterSet} ExplorerFilterSet */
/** @typedef {import('../../GuppyDataExplorer/types').ExplorerFilterSetDTO} ExplorerFilterSetDTO */
/** @typedef {import('../../GuppyDataExplorer/types').SurvivalAnalysisConfig} SurvivalAnalysisConfig */

/**
 * @param {ExplorerFilterSet} filterSet
 * @returns {ExplorerFilterSetDTO}
 */
export function convertToFilterSetDTO({ filter: filters, ...rest }) {
  return { ...rest, filters };
}

/**
 * @param {ExplorerFilterSetDTO} filterSetDTO
 * @returns {ExplorerFilterSet}
 */
export function convertFromFilterSetDTO({ filters, ...rest }) {
  return {
    ...rest,
    filter:
      '__combineMode' in filters
        ? filters
        : // backward compat for old filter sets missing __combineMode value
          { __combineMode: 'AND', ...filters },
  };
}

/**
 * @param {FilterConfig} filterConfig
 * @param {GuppyConfig['fieldMapping']} [fieldMapping]
 */
export function createFilterInfo(filterConfig, fieldMapping = []) {
  const map = /** @type {FilterConfig['info']} */ ({});

  for (const { field, name, tooltip } of fieldMapping)
    map[field] = { label: name ?? capitalizeFirstLetter(field), tooltip };

  const allFields = filterConfig.tabs.flatMap(({ fields }) => fields);
  if ('anchor' in filterConfig) allFields.push(filterConfig.anchor.field);

  for (const field of allFields)
    if (!(field in map)) map[field] = { label: capitalizeFirstLetter(field) };

  return map;
}

/** @param {SurvivalAnalysisConfig} config */
export function isSurvivalAnalysisEnabled(config) {
  if (config?.result !== undefined)
    for (const option of ['risktable', 'survival'])
      if (config.result[option] !== undefined && config.result[option])
        return true;

  return false;
}

/** @param {number} explorerId */
export function getCurrentConfig(explorerId) {
  const config = explorerConfig.find(({ id }) => id === explorerId);
  return {
    adminAppliedPreFilters: config.adminAppliedPreFilters,
    buttonConfig: {
      buttons: config.buttons,
      dropdowns: config.dropdowns,
      sevenBridgesExportURL: config.sevenBridgesExportURL,
      terraExportURL: config.terraExportURL,
      terraTemplate: config.terraTemplate,
    },
    chartConfig: config.charts,
    filterConfig: {
      ...config.filters,
      info: createFilterInfo(config.filters, config.guppyConfig.fieldMapping),
    },
    getAccessButtonLink: config.getAccessButtonLink,
    guppyConfig: config.guppyConfig,
    hideGetAccessButton: config.hideGetAccessButton,
    patientIdsConfig: config.patientIds,
    survivalAnalysisConfig: {
      ...config.survivalAnalysis,
      enabled: isSurvivalAnalysisEnabled(config.survivalAnalysis),
    },
    tableConfig: config.table,
  };
}

/** @param {import('./types').ExplorerFilter} filter */
export function checkIfFilterEmpty(filter) {
  const { __combineMode, ..._filter } = filter;
  return Object.keys(_filter).length === 0;
}

export const workspacesSessionStorageKey = 'explorer:workspaces';

/** @returns {import('./types').ExplorerState['workspaces']} */
export function initializeWorkspaces(explorerId) {
  try {
    const str = window.sessionStorage.getItem(workspacesSessionStorageKey);
    if (str === null) throw new Error('No stored workspaces');
    return JSON.parse(str);
  } catch (e) {
    if (e.message !== 'No stored workspaces') console.error(e);

    const activeId = crypto.randomUUID();
    const filterSet = { filter: {} };
    return {
      [explorerId]: { activeId, all: { [activeId]: filterSet } },
    };
  }
}
