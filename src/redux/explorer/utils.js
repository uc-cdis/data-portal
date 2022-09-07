import { explorerConfig } from '../../localconf';
import { capitalizeFirstLetter } from '../../utils';
import { FILTER_TYPE } from '../../GuppyComponents/Utils/const';
import { getGQLFilter } from '../../GuppyComponents/Utils/queries';

/** @typedef {import('../../GuppyComponents/types').GuppyConfig} GuppyConfig */
/** @typedef {import('../../GuppyComponents/types').FilterConfig} FilterConfig */
/** @typedef {import('../../GuppyDataExplorer/types').ExplorerFilterSet} ExplorerFilterSet */
/** @typedef {import('../../GuppyDataExplorer/types').ExplorerFilterSetDTO} ExplorerFilterSetDTO */
/** @typedef {import('../../GuppyDataExplorer/types').RefFilterState} RefFilterState */
/** @typedef {import('../../GuppyDataExplorer/types').SurvivalAnalysisConfig} SurvivalAnalysisConfig */
/** @typedef {import('../../GuppyDataExplorer/types').SavedExplorerFilterSet} SavedExplorerFilterSet */
/** @typedef {import('./types').ExplorerState} ExplorerState */
/** @typedef {import('./types').ExplorerWorkspace} ExplorerWorkspace */

/**
 * @param {ExplorerFilterSet['filter'] | RefFilterState} filter
 * @param {ExplorerWorkspace} workspace
 * @returns {SavedExplorerFilterSet['filter']}
 */
export function dereferenceFilter(filter, workspace) {
  if (filter.__type === FILTER_TYPE.COMPOSED)
    return {
      __combineMode: filter.__combineMode,
      __type: filter.__type,
      value: filter.value.map((f) => dereferenceFilter(f, workspace)),
    };

  if (filter.__type === 'REF')
    return dereferenceFilter(workspace.all[filter.value.id].filter, workspace);

  return filter;
}

/** @param {ExplorerWorkspace} workspace */
export function updateFilterRefs(workspace) {
  const ids = Object.keys(workspace.all);
  const filterSets = Object.values(workspace.all);

  for (const { filter } of filterSets)
    if ('refIds' in filter)
      for (const [index, refId] of [...filter.refIds].entries()) {
        const refIndex = filter.value.findIndex(
          ({ __type, value }) => __type === 'REF' && value.id === refId
        );

        if (refId in workspace.all) {
          /** @type {RefFilterState} */ (filter.value[refIndex]).value.label =
            workspace.all[refId].name ??
            `#${ids.findIndex((id) => id === refId) + 1}`;
        } else {
          filter.value.splice(refIndex, 1);
          filter.refIds.splice(index, 1);
        }
      }
}

/**
 * @param {SavedExplorerFilterSet} filterSet
 * @returns {ExplorerFilterSetDTO}
 */
export function convertToFilterSetDTO({ filter: filters, ...rest }) {
  return { ...rest, filters, gqlFilter: getGQLFilter(filters) };
}

/** @returns {ExplorerFilterSet['filter']['value']} */
export function polyfillFilterValue(filter) {
  const value = {};
  for (const [key, val] of Object.entries(filter))
    if (key.includes(':'))
      value[key] = {
        __type: FILTER_TYPE.ANCHORED,
        value: polyfillFilterValue(val.filter),
      };
    else if ('selectedValues' in val)
      value[key] = { __type: FILTER_TYPE.OPTION, ...val };
    else if ('lowerBound' in val)
      value[key] = { __type: FILTER_TYPE.RANGE, ...val };

  return value;
}

/**
 * @param {{ [key: string]: any }} filter
 * @returns {SavedExplorerFilterSet['filter']}
 */
export function polyfillFilter({ __combineMode, __type, ...rest }) {
  const shouldPolyfill =
    !('value' in rest) ||
    (Object.keys(rest.value).length > 0 &&
      !('__type' in Object.values(rest.value)[0]));

  return {
    __combineMode: __combineMode ?? 'AND',
    __type: __type ?? FILTER_TYPE.STANDARD,
    value: shouldPolyfill ? polyfillFilterValue(rest) : rest.value,
  };
}

/**
 * @param {ExplorerFilterSetDTO} filterSetDTO
 * @returns {SavedExplorerFilterSet}
 */
export function convertFromFilterSetDTO({ filters, ...rest }) {
  return {
    ...rest,
    filter: polyfillFilter(filters),
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
    survivalAnalysisConfig: { enabled: false },
    tableConfig: config.table,
  };
}

/** @param {ExplorerFilterSet['filter']} filter */
export function checkIfFilterEmpty(filter) {
  return filter.__type === FILTER_TYPE.COMPOSED
    ? filter.value.length === 0
    : Object.keys(filter.value ?? {}).length === 0;
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

/**
 * @param {{ name: string }} a a.name has a format: [index]. [filterSetName]
 * @param {{ name: string }} b b.name has a format: [index]. [filterSetName]
 */
function sortByIndexCompareFn(a, b) {
  const [aIndex] = a.name.split('.');
  const [bIndex] = b.name.split('.');
  return Number.parseInt(aIndex, 10) - Number.parseInt(bIndex, 10);
}

/**
 * @param {Object} args
 * @param {ExplorerState['config']['survivalAnalysisConfig']} args.config
 * @param {ExplorerState['survivalAnalysisResult']['data']} args.result
 * @returns {ExplorerState['survivalAnalysisResult']['parsed']}
 */
export function parseSurvivalResult({ config, result }) {
  const parsed = { count: {} };
  if (config.result?.risktable) parsed.risktable = [];
  if (config.result?.survival) parsed.survival = [];
  if (result === null) return parsed;

  for (const { name, count, risktable, survival } of Object.values(result)) {
    if (count !== undefined) parsed.count[name.split('. ')[1]] = count;
    parsed.risktable?.push({ data: risktable, name });
    parsed.survival?.push({ data: survival, name });
  }
  parsed.risktable?.sort(sortByIndexCompareFn);
  parsed.survival?.sort(sortByIndexCompareFn);
  return parsed;
}
