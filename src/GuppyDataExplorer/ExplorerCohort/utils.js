import { fetchWithCreds } from '../../actions';
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
    return data.searches;
  });
}

/**
 * @param {ExplorerCohort} cohort
 * @returns {Promise<ExplorerCohort>}
 */
export function saveCohort(cohort) {
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
    ? string.slice(0, maxLength - 3) + '...'
    : string;
}
