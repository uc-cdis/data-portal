import { useMemo, useState } from 'react';
import { getGQLFilter } from '../../GuppyComponents/Utils/queries';
import { fetchWithCreds } from '../../actions';
import { useExplorerConfig } from '../ExplorerConfigContext';
import '../typedef';

/**
 * @typedef {Object} ExplorerFilterSetDTO
 * @property {string} description
 * @property {GqlFilter} filters
 * @property {number} id
 * @property {string} name
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

/** @returns {[[RisktableData[], SurvivalData[]], (usedFilterSets: ExplorerFilterSet[]) => Promise<void>]} */
export default function useSurvivalAnalysisResult() {
  const { current, explorerId } = useExplorerConfig();
  const config = current.survivalAnalysisConfig;

  const [result, setResult] = useState(emptyData);
  const parsedResult = useMemo(() => {
    /** @type {[RisktableData[], SurvivalData[]]} */
    const parsed = [[], []];
    const [r, s] = parsed;
    for (const { name, risktable, survival } of Object.values(result)) {
      if (config.result?.risktable) r.push({ data: risktable, name });
      if (config.result?.survival) s.push({ data: survival, name });
    }
    r.sort(sortByIndexCompareFn);
    s.sort(sortByIndexCompareFn);
    return parsed;
  }, [result]);

  /**
   * @param {Object} body
   * @param {ExplorerFilterSetDTO[]} body.filterSets
   * @param {number[]} body.usedFilterSetIds
   * @returns {Promise<SurvivalAnalysisResult>}
   */
  function fetchResult(body) {
    return fetchWithCreds({
      path: '/analysis/tools/survival',
      method: 'POST',
      body: JSON.stringify({ ...body, explorerId, result: config.result }),
    }).then(({ response, data, status }) => {
      if (status !== 200) throw response.statusText;
      return data;
    });
  }

  /** @param {ExplorerFilterSet[]} usedFilterSets */
  function refreshResult(usedFilterSets) {
    /** @type {{ filterSets: ExplorerFilterSetDTO[]; usedFilterSetIds: number[] }} */
    const body = { filterSets: [], usedFilterSetIds: [] };
    /** @type {SurvivalAnalysisResult} */
    const cache = {};
    for (const [index, usedFilterSet] of usedFilterSets.entries()) {
      const { description, filters, id, name } = usedFilterSet;
      body.usedFilterSetIds.push(id);
      if (id in result)
        cache[id] = { ...result[id], name: `${index + 1}. ${name}` };
      else
        body.filterSets.push({
          description,
          filters: getGQLFilter(filters) ?? {},
          id,
          name: `${index + 1}. ${name}`,
        });
    }

    if (body.filterSets.length > 0)
      return fetchResult(body).then((data) => setResult({ ...cache, ...data }));

    setResult(cache);
    return Promise.resolve();
  }

  return [parsedResult, refreshResult];
}
