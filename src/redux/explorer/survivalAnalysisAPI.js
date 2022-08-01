import { fetchWithCreds } from '../utils.fetch';

/** @typedef {import('../../GuppyComponents/types').GqlFilter} GqlFilter */
/** @typedef {import('./types').ExplorerConfig} ExplorerConfig */
/** @typedef {import('./types').ExplorerState} ExplorerState */

/**
 * @typedef {Object} SurvivalFilterSetDTO
 * @property {GqlFilter} filters
 * @property {number} id
 * @property {string} name
 */

/**
 * @param {Object} body
 * @param {boolean} body.efsFlag
 * @param {ExplorerState['explorerId']} body.explorerId
 * @param {SurvivalFilterSetDTO[]} body.filterSets
 * @param {ExplorerConfig['survivalAnalysisConfig']['result']} body.result
 * @param {SurvivalFilterSetDTO['id'][]} body.usedFilterSetIds
 * @returns {Promise<ExplorerState['survivalAnalysisResult']['data']>}
 */
export function fetchResult(body) {
  return fetchWithCreds({
    path: '/analysis/tools/survival',
    method: 'POST',
    body: JSON.stringify(body),
  }).then(({ response, data, status }) => {
    if (status !== 200) throw response.statusText;
    return data;
  });
}
