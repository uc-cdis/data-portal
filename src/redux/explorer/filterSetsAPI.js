import { fetchWithCreds } from '../utils.fetch';
import { convertFromFilterSetDTO, convertToFilterSetDTO } from './utils';

/** @typedef {import('./types').ExplorerFilterSet} ExplorerFilterSet */
/** @typedef {import('../../GuppyDataExplorer/types').SavedExplorerFilterSet} SavedExplorerFilterSet */

const FILTER_SET_URL = '/amanuensis/filter-sets';

/**
 * @param {number} explorerId
 * @param {SavedExplorerFilterSet} filterSet
 * @returns {Promise<SavedExplorerFilterSet>}
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
 * @param {SavedExplorerFilterSet} filterSet
 */
export function deleteById(explorerId, filterSet) {
  return fetchWithCreds({
    path: `${FILTER_SET_URL}/${filterSet.id}?explorerId=${explorerId}`,
    method: 'DELETE',
  }).then(({ response, status }) => {
    if (status !== 200) throw response.statusText;
    return filterSet.id;
  });
}

/**
 * @param {number} explorerId
 * @returns {Promise<SavedExplorerFilterSet[]>}
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
 * @param {SavedExplorerFilterSet} filterSet
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

/**
 * @param {SavedExplorerFilterSet} filterSet
 * @returns {Promise<string>}
 */
export function createToken(filterSet) {
  return fetchWithCreds({
    path: `${FILTER_SET_URL}/snapshot`,
    method: 'POST',
    body: JSON.stringify({ filterSetId: filterSet.id }),
  }).then(({ response, data, status }) => {
    if (status !== 200) throw response.statusText;
    return data;
  });
}

/**
 * @param {string} token
 * @returns {Promise<SavedExplorerFilterSet>}
 */
export function fetchWithToken(token) {
  return fetchWithCreds({
    path: `${FILTER_SET_URL}/snapshot/${token}`,
  }).then(({ response, data, status }) => {
    if (status !== 200) throw response.statusText;
    return convertFromFilterSetDTO(data);
  });
}
