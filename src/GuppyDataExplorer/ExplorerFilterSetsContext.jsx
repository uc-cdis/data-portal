import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { fetchWithCreds } from '../actions';
import './typedef';
import { useExplorerConfig } from './ExplorerConfigContext';

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
 * @typedef {Object} ExplorerFilterSetsContext
 * @property {ExplorerFilterSet[]} filterSets
 * @property {() => Promise<void>} refreshFilterSets
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
