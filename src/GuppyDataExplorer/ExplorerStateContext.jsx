import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useExplorerConfig } from './ExplorerConfigContext';
import { extractExplorerStateFromURL } from './utils';
import './typedef';

/**
 * @typedef {Object} ExplorerStateContext
 * @property {FilterState} initialAppliedFilters
 * @property {string[]} patientIds
 * @property {() => void} handleBrowserNavigationForState
 * @property {(filter: FilterState) => void} handleFilterChange
 * @property {(patientIds: string[]) => void} handlePatientIdsChange
 * @property {() => void} clearFilters
 * @property {(filters) => void} updateFilters
 */

/** @type {React.Context<ExplorerStateContext>} */
const ExplorerStateContext = createContext(null);

export function ExplorerStateProvider({ children }) {
  const history = useHistory();
  const {
    current: { filterConfig, patientIdsConfig },
    shouldUpdateState,
    setShouldUpdateState,
  } = useExplorerConfig();

  const initialState = useMemo(
    () =>
      extractExplorerStateFromURL(
        new URLSearchParams(history.location.search),
        filterConfig,
        patientIdsConfig
      ),
    []
  );
  const [filters, setFilters] = useState(initialState.initialAppliedFilters);
  const [patientIds, setPatientIds] = useState(initialState.patientIds);
  useEffect(() => {
    if (shouldUpdateState) {
      const newState = extractExplorerStateFromURL(
        new URLSearchParams(history.location.search),
        filterConfig,
        patientIdsConfig
      );
      setFilters(newState.initialAppliedFilters);
      setPatientIds(newState.patientIds);
      setShouldUpdateState(false);
    }
  }, [shouldUpdateState]);

  const isBrowserNavigation = useRef(false);
  function handleBrowserNavigationForState() {
    isBrowserNavigation.current = true;
    const newState = extractExplorerStateFromURL(
      new URLSearchParams(history.location.search),
      filterConfig,
      patientIdsConfig
    );
    setFilters(newState.initialAppliedFilters);
    setPatientIds(newState.patientIds);
    isBrowserNavigation.current = false;
  }

  /** @param {FilterState} filter */
  function handleFilterChange(filter) {
    const searchParams = new URLSearchParams(history.location.search);
    searchParams.delete('filter');

    if (filter && Object.keys(filter).length > 0) {
      /** @type {string[]} */
      const allSearchFields = [];
      for (const { searchFields } of filterConfig.tabs)
        if (searchFields?.length > 0) allSearchFields.push(...searchFields);

      if (allSearchFields.length === 0) {
        searchParams.set('filter', JSON.stringify(filter));
      } else {
        const allSearchFieldSet = new Set(allSearchFields);
        const filterWithoutSearchFields = {};
        for (const field of Object.keys(filter))
          if (!allSearchFieldSet.has(field))
            filterWithoutSearchFields[field] = filter[field];

        if (Object.keys(filterWithoutSearchFields).length > 0)
          searchParams.set('filter', JSON.stringify(filterWithoutSearchFields));
      }
    }

    if (!isBrowserNavigation.current)
      history.push({
        search: decodeURIComponent(searchParams.toString()),
        state: { scrollY: window.scrollY },
      });
  }

  /** @param {string[]} ids */
  function handlePatientIdsChange(ids) {
    if (patientIdsConfig?.filter === undefined) return;

    const searchParams = new URLSearchParams(history.location.search);
    searchParams.delete('patientIds');

    if (ids.length > 0) searchParams.set('patientIds', ids.join(','));

    setPatientIds(ids);
    if (!isBrowserNavigation.current)
      history.push({ search: decodeURIComponent(searchParams.toString()) });
  }

  function clearFilters() {
    setFilters({});
  }

  return (
    <ExplorerStateContext.Provider
      value={{
        initialAppliedFilters: filters,
        patientIds,
        handleBrowserNavigationForState,
        handleFilterChange,
        handlePatientIdsChange,
        clearFilters,
        updateFilters: setFilters,
      }}
    >
      {children}
    </ExplorerStateContext.Provider>
  );
}

ExplorerStateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useExplorerState = () => useContext(ExplorerStateContext);
