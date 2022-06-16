import { useMemo, useRef, useState } from 'react';
import { getGQLFilter } from '../../GuppyComponents/Utils/queries';
import { fetchWithCreds } from '../../utils.fetch';
import { useExplorerConfig } from '../ExplorerConfigContext';

/** @typedef {import('./types').ExplorerFilterSet} ExplorerFilterSet */
/** @typedef {import('./types').GqlFilter} GqlFilter */
/** @typedef {import('./types').RisktableData} RisktableData */
/** @typedef {import('./types').SurvivalAnalysisResult} SurvivalAnalysisResult */
/** @typedef {import('./types').SurvivalData} SurvivalData */
/** @typedef {import('./types').ParsedSurvivalAnalysisResult} ParsedSurvivalAnalysisResult */

/**
 * @typedef {Object} ExplorerFilterSetDTO
 * @property {GqlFilter} filters
 * @property {number} id
 * @property {string} name
 */

/**
 * @typedef {Object} SurvivalAnalysisRequestBody
 * @property {boolean} efsFlag
 * @property {ExplorerFilterSetDTO[]} filterSets
 * @property {number[]} usedFilterSetIds
 */

/**
 * @param {{ name: string }} a a.name has a format: [index]. [filterSetName]
 * @param {{ name: string }} b b.name has a format: [index]. [filterSetName]
 */
function sortByIndexCompareFn(a, b) {
  const [aIndex] = a.name.split('.');
  const [bIndex] = b.name.split('.');
  return Number.parseInt(aIndex, 10) - Number.parseInt(bIndex, 10);
}

/** @type {SurvivalAnalysisResult} */
const emptyData = {};

/**
 * @callback SurvivalAnalysisRefreshHandler
 * @param {{ efsFlag: boolean; usedFilterSets: ExplorerFilterSet[]}} args
 * @returns {Promise<void>}
 */

/** @returns {[ ParsedSurvivalAnalysisResult, SurvivalAnalysisRefreshHandler ]} */
export default function useSurvivalAnalysisResult() {
  const { current, explorerId } = useExplorerConfig();
  const config = current.survivalAnalysisConfig;

  const prevEfsFlag = useRef(false);
  const [result, setResult] = useState(emptyData);
  const parsedResult = useMemo(() => {
    if (result === null) return {};

    /** @type {ParsedSurvivalAnalysisResult} */
    const parsed = { count: {}, risktable: [], survival: [] };
    const { count: c, risktable: r, survival: s } = parsed;
    for (const { name, count, risktable, survival } of Object.values(result)) {
      if (count !== undefined) c[name.split('. ')[1]] = count;
      if (config.result?.risktable) r.push({ data: risktable, name });
      if (config.result?.survival) s.push({ data: survival, name });
    }
    r.sort(sortByIndexCompareFn);
    s.sort(sortByIndexCompareFn);
    return parsed;
  }, [result]);

  /**
   * @param {SurvivalAnalysisRequestBody} body
   * @returns {Promise<SurvivalAnalysisResult>}
   */
  function fetchResult(body) {
    return fetchWithCreds({
      path: '/analysis/tools/survival',
      method: 'POST',
      body: JSON.stringify({ ...body, explorerId, result: config.result }),
    }).then(({ response, data, status }) => {
      if (status === 404) throw data;
      if (status !== 200) throw response.statusText;
      return data;
    });
  }

  /** @type {SurvivalAnalysisRefreshHandler} */
  function refreshResult({ efsFlag, usedFilterSets }) {
    const isSurvivalTypeChanged = prevEfsFlag.current !== efsFlag;
    if (isSurvivalTypeChanged) prevEfsFlag.current = efsFlag;

    /** @type {SurvivalAnalysisRequestBody} */
    const body = { efsFlag, filterSets: [], usedFilterSetIds: [] };
    /** @type {SurvivalAnalysisResult} */
    const cache = {};
    for (const [index, usedFilterSet] of usedFilterSets.entries()) {
      const { filter, id, name } = usedFilterSet;
      body.usedFilterSetIds.push(id);
      if (result !== null && id in result && !isSurvivalTypeChanged)
        cache[id] = { ...result[id], name: `${index + 1}. ${name}` };
      else
        body.filterSets.push({
          filters: getGQLFilter(filter) ?? {},
          id,
          name: `${index + 1}. ${name}`,
        });
    }

    if (body.filterSets.length > 0)
      return fetchResult(body)
        .then((data) => setResult({ ...cache, ...data }))
        .catch((e) => {
          setResult(null);
          throw e;
        });

    setResult(cache);
    return Promise.resolve();
  }

  return [parsedResult, refreshResult];
}
