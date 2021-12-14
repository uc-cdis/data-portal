import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { fetchWithCreds } from '../actions';
import './typedef';

const FILTER_SET_URL = '/amanuensis/filter-set';

/** @returns {Promise<ExplorerFilterSet[]>} */
function fetchFilterSets() {
  return fetchWithCreds({
    path: FILTER_SET_URL,
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
 * @typedef {Object} ExplorerFilterSetsContext
 * @property {ExplorerFilterSet[]} filterSets
 * @property {() => Promise<void>} refreshFilterSets
 */

/** @type {React.Context<ExplorerFilterSetsContext>} */
const ExplorerFilterSetsContext = createContext(null);

/** @type {ExplorerFilterSet[]} */
const emptyFilterSets = [];
export function ExplorerFilterSetsProvider({ children }) {
  const [filterSets, setFilterSets] = useState(emptyFilterSets);
  return (
    <ExplorerFilterSetsContext.Provider
      value={{
        filterSets,
        refreshFilterSets: () => fetchFilterSets().then(setFilterSets),
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
