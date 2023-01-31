import { fetchWithCreds } from '../utils.fetch';
import { isSurvivalAnalysisEnabled } from './utils';

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
 * @param {SurvivalFilterSetDTO['id'][]} body.usedFilterSetIds
 * @returns {Promise<ExplorerState['survivalAnalysisResult']['data']>}
 */
export function fetchResult(body) {
  return fetchWithCreds({
    path: '/analysis/tools/survival',
    method: 'POST',
    body: JSON.stringify(body),
  }).then(({ response, data, status }) => {
    if (status !== 200) {
      throw response.statusText;
    }
    return data;
  });
}

/** @returns {Promise<ExplorerState['config']['survivalAnalysisConfig']>} */
export function fetchConfig() {
  return fetchWithCreds({
    path: '/analysis/tools/survival/config',
    method: 'GET',
  }).then(({ response, data, status }) => {
    if (status !== 200) throw response.statusText;
    return { ...data, enabled: isSurvivalAnalysisEnabled(data) };
  });
}
