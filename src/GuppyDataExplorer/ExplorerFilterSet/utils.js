import { fetchWithCreds } from '../../actions';
import { capitalizeFirstLetter } from '../../utils';
import './typedef';

const FILTER_SET_URL = '/amanuensis/filter-sets';

/**
 * @param {number} explorerId
 * @param {ExplorerFilterSet} filterSet
 * @returns {Promise<ExplorerFilterSet>}
 */
export function createFilterSet(explorerId, filterSet) {
  return fetchWithCreds({
    path: `${FILTER_SET_URL}?explorerId=${explorerId}`,
    method: 'POST',
    body: JSON.stringify(filterSet),
  }).then(({ response, data, status }) => {
    if (status !== 200) throw response.statusText;
    return data;
  });
}

/**
 * @param {number} explorerId
 * @param {ExplorerFilterSet} filterSet
 */
export function updateFilterSet(explorerId, filterSet) {
  const { id, ...requestBody } = filterSet;
  return fetchWithCreds({
    path: `${FILTER_SET_URL}/${id}?explorerId=${explorerId}`,
    method: 'PUT',
    body: JSON.stringify(requestBody),
  }).then(({ response, status }) => {
    if (status !== 200) throw response.statusText;
  });
}

/**
 * @param {number} explorerId
 * @param {ExplorerFilterSet} filterSet
 */
export function deleteFilterSet(explorerId, filterSet) {
  return fetchWithCreds({
    path: `${FILTER_SET_URL}/${filterSet.id}?explorerId=${explorerId}`,
    method: 'DELETE',
  }).then(({ response, status }) => {
    if (status !== 200) throw response.statusText;
  });
}

/**
 * @return {ExplorerFilterSet}
 */
export function createEmptyFilterSet() {
  return {
    name: '',
    description: '',
    filters: {},
  };
}

/**
 * @param {string} string
 * @param {number} maxLength
 */
export function truncateWithEllipsis(string, maxLength) {
  return string.length > maxLength
    ? `${string.slice(0, maxLength - 3)}...`
    : string;
}

/**
 * @param {ExplorerFilters} filters
 * @param {number} level Nesting level
 */
export function stringifyFilters(filters, level = 0) {
  if (Object.keys(filters).length === 0) return '';

  let filterStr = '';
  for (const [key, value] of Object.entries(filters)) {
    if ('filter' in value) {
      const [anchorFieldName, anchorValue] = key.split(':');
      filterStr += `${'\t'.repeat(level)}* ${capitalizeFirstLetter(
        anchorFieldName
      )}: '${capitalizeFirstLetter(anchorValue)}'\n`;
      filterStr += stringifyFilters(value.filter, level + 1);
    } else {
      filterStr += `${'\t'.repeat(level)}* ${capitalizeFirstLetter(key)}\n`;
      if ('selectedValues' in value)
        for (const selected of value.selectedValues)
          filterStr += `${'\t'.repeat(level + 1)}- '${selected}'\n`;
      else if ('lowerBound' in value)
        filterStr += `${'\t'.repeat(level + 1)}- from: ${
          value.lowerBound
        }\n${'\t'.repeat(level + 1)}- to: ${value.upperBound}\n`;
    }
  }

  return filterStr;
}
