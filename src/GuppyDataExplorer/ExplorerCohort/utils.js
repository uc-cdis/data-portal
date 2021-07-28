import { fetchWithCreds } from '../../actions';
import { capitalizeFirstLetter } from '../../utils';
import './typedef';

const COHORT_URL = '/amanuensis/cohort';

/**
 * @returns {Promise<ExplorerCohort[]>}
 */
export function fetchCohorts() {
  return fetchWithCreds({
    path: COHORT_URL,
    method: 'GET',
  }).then(({ response, data, status }) => {
    if (status !== 200) throw response.statusText;
    if (
      data === null ||
      typeof data !== 'object' ||
      data.searches === undefined ||
      !Array.isArray(data.searches)
    )
      throw new Error('Error: Incorrect Response Data');
    return data.searches;
  });
}

/**
 * @param {ExplorerCohort} cohort
 * @returns {Promise<ExplorerCohort>}
 */
export function createCohort(cohort) {
  return fetchWithCreds({
    path: COHORT_URL,
    method: 'POST',
    body: JSON.stringify(cohort),
  }).then(({ response, data, status }) => {
    if (status !== 200) throw response.statusText;
    return data;
  });
}

/**
 * @param {ExplorerCohort} cohort
 */
export function updateCohort(cohort) {
  const { id, ...requestBody } = cohort;
  return fetchWithCreds({
    path: `${COHORT_URL}/${id}`,
    method: 'PUT',
    body: JSON.stringify(requestBody),
  }).then(({ response, status }) => {
    if (status !== 200) throw response.statusText;
  });
}

/**
 * @param {ExplorerCohort} cohort
 */
export function deleteCohort(cohort) {
  return fetchWithCreds({
    path: `${COHORT_URL}/${cohort.id}`,
    method: 'DELETE',
  }).then(({ response, status }) => {
    if (status !== 200) throw response.statusText;
  });
}

/**
 * @return {ExplorerCohort}
 */
export function createEmptyCohort() {
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
