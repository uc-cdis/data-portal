import { fetchWithCreds } from '../utils.fetch';
import { convertFromFilterSetDTO, convertToFilterSetDTO } from './utils';

/** @typedef {import('../../GuppyDataExplorer/types').ExplorerFilterSet} ExplorerFilterSet */

const FILTER_SET_URL = '/amanuensis/filter-sets';

/**
 * @param {number} explorerId
 * @param {ExplorerFilterSet} filterSet
 * @returns {Promise<ExplorerFilterSet>}
 */
export function createNew(explorerId, filterSet) {
  return fetchWithCreds({
    path: `${FILTER_SET_URL}?explorerId=${explorerId}`,
    method: 'POST',
    body: JSON.stringify(convertToFilterSetDTO(filterSet)),
  }).then(({ response, data, status }) => {
    if (status !== 200) throw response.statusText;
    return convertFromFilterSetDTO(data);
  });
}

/**
 * @param {number} explorerId
 * @param {ExplorerFilterSet} filterSet
 */
export function deleteById(explorerId, filterSet) {
  return fetchWithCreds({
    path: `${FILTER_SET_URL}/${filterSet.id}?explorerId=${explorerId}`,
    method: 'DELETE',
  }).then(({ response, status }) => {
    if (status !== 200) throw response.statusText;
  });
}

/**
 * @param {number} explorerId
 * @returns {Promise<ExplorerFilterSet[]>}
 */
export function fetchAll(explorerId) {
  return fetchWithCreds({
    path: `${FILTER_SET_URL}?explorerId=${explorerId}`,
    method: 'GET',
  }).then(({ response, data, status }) => {
    if (status !== 200) throw response.statusText;
    if (
      data === null ||
      typeof data !== 'object' ||
      data.filter_sets === undefined ||
      !Array.isArray(data.filter_sets)
    )
      throw new Error('Error: Incorrect Response Data');
    return data.filter_sets.map(convertFromFilterSetDTO);
  });
}

/**
 * @param {number} explorerId
 * @param {ExplorerFilterSet} filterSet
 */
export function updateById(explorerId, filterSet) {
  const { id, ...requestBody } = filterSet;
  return fetchWithCreds({
    path: `${FILTER_SET_URL}/${id}?explorerId=${explorerId}`,
    method: 'PUT',
    body: JSON.stringify(convertToFilterSetDTO(requestBody)),
  }).then(({ response, status }) => {
    if (status !== 200) throw response.statusText;
    return filterSet;
  });
}
