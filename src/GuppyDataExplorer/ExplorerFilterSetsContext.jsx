import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { fetchWithCreds } from '../actions';
import { useExplorerConfig } from './ExplorerConfigContext';

/** @typedef {import('./types').ExplorerFilterSet} ExplorerFilterSet */

const FILTER_SET_URL = '/amanuensis/filter-sets';

/**
 * @param {number} explorerId
 * @returns {Promise<ExplorerFilterSet[]>}
 */
function fetchFilterSets(explorerId) {
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
    return data.filter_sets;
  });
}

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
export function deleteFilterSet(explorerId, filterSet) {
  return fetchWithCreds({
    path: `${FILTER_SET_URL}/${filterSet.id}?explorerId=${explorerId}`,
    method: 'DELETE',
  }).then(({ response, status }) => {
    if (status !== 200) throw response.statusText;
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
 * @typedef {Object} ExplorerFilterSetsContext
 * @property {ExplorerFilterSet[]} filterSets
 * @property {() => Promise<void>} refreshFilterSets
 * @property {(filerSet: ExplorerFilterSet) => Promise<ExplorerFilterSet>} createFilterSet
 * @property {(filerSet: ExplorerFilterSet) => Promise<void>} deleteFilterSet
 * @property {(filerSet: ExplorerFilterSet) => Promise<void>} updateFilterSet
 */

/** @type {React.Context<ExplorerFilterSetsContext>} */
const ExplorerFilterSetsContext = createContext(null);

/** @type {ExplorerFilterSet[]} */
const emptyFilterSets = [];
export function ExplorerFilterSetsProvider({ children }) {
  const { explorerId } = useExplorerConfig();
  const [filterSets, setFilterSets] = useState(emptyFilterSets);
  return (
    <ExplorerFilterSetsContext.Provider
      value={{
        filterSets,
        refreshFilterSets: () =>
          fetchFilterSets(explorerId).then(setFilterSets),
        createFilterSet: (filterSet) => createFilterSet(explorerId, filterSet),
        deleteFilterSet: (filterSet) => deleteFilterSet(explorerId, filterSet),
        updateFilterSet: (filterSet) => updateFilterSet(explorerId, filterSet),
      }}
    >
      {children}
    </ExplorerFilterSetsContext.Provider>
  );
}

ExplorerFilterSetsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useExplorerFilterSets = () =>
  useContext(ExplorerFilterSetsContext);
