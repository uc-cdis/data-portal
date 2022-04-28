import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useExplorerConfig } from './ExplorerConfigContext';
import { extractExplorerStateFromURL } from './utils';

/** @typedef {import('./types').ExplorerFilter} ExplorerFilter */

/**
 * @typedef {Object} ExplorerStateContext
 * @property {ExplorerFilter} initialAppliedFilters
 * @property {string[]} patientIds
 * @property {() => void} handleBrowserNavigationForState
 * @property {(filter: ExplorerFilter) => void} handleFilterChange
 * @property {() => void} handleFilterClear
 * @property {(patientIds: string[]) => void} handlePatientIdsChange
 */

/** @type {React.Context<ExplorerStateContext>} */
const ExplorerStateContext = createContext(null);

export function ExplorerStateProvider({ children }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    current: { filterConfig, patientIdsConfig },
    shouldUpdateState,
    setShouldUpdateState,
  } = useExplorerConfig();

  const initialState = useMemo(
    () =>
      extractExplorerStateFromURL(searchParams, filterConfig, patientIdsConfig),
    []
  );
  const [filters, setFilters] = useState(initialState.initialAppliedFilters);
  const [patientIds, setPatientIds] = useState(initialState.patientIds);
  useEffect(() => {
    if (shouldUpdateState) {
      const newState = extractExplorerStateFromURL(
        searchParams,
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
      new URL(document.URL).searchParams,
      filterConfig,
      patientIdsConfig
    );
    setFilters(newState.initialAppliedFilters);
    setPatientIds(newState.patientIds);
    isBrowserNavigation.current = false;
  }

  /** @param {ExplorerFilter} filter */
  function handleFilterChange(filter) {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('filter');

    let newFilters = /** @type {ExplorerFilter} */ ({});
    if (filter && Object.keys(filter).length > 0) {
      /** @type {string[]} */
      const allSearchFields = [];
      for (const { searchFields } of filterConfig.tabs)
        if (searchFields?.length > 0) allSearchFields.push(...searchFields);

      if (allSearchFields.length === 0) {
        newFilters = /** @type {ExplorerFilter} */ ({
          __combineMode: filters.__combineMode,
          ...filter,
        });
      } else {
        const allSearchFieldSet = new Set(allSearchFields);
        const filterWithoutSearchFields = /** @type {ExplorerFilter} */ ({});
        for (const field of Object.keys(filter))
          if (!allSearchFieldSet.has(field))
            filterWithoutSearchFields[field] = filter[field];

        if (Object.keys(filterWithoutSearchFields).length > 0)
          newFilters = /** @type {ExplorerFilter} */ ({
            __combineMode: filters.__combineMode,
            ...filterWithoutSearchFields,
          });
      }

      newSearchParams.set('filter', JSON.stringify(newFilters));
    }
    setFilters(newFilters);

    if (!isBrowserNavigation.current)
      navigate(`?${decodeURIComponent(newSearchParams.toString())}`, {
        state: { scrollY: window.scrollY },
      });
  }

  /** @param {string[]} ids */
  function handlePatientIdsChange(ids) {
    if (patientIdsConfig?.filter === undefined) return;

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('patientIds');

    if (ids.length > 0) newSearchParams.set('patientIds', ids.join(','));

    setPatientIds(ids);
    if (!isBrowserNavigation.current)
      navigate(`?${decodeURIComponent(newSearchParams.toString())}`);
  }

  function handleFilterClear() {
    handleFilterChange(undefined);
  }

  const value = useMemo(
    () => ({
      initialAppliedFilters: filters,
      patientIds,
      handleBrowserNavigationForState,
      handleFilterChange,
      handleFilterClear,
      handlePatientIdsChange,
    }),
    [filters, patientIds, searchParams]
  );

  return (
    <ExplorerStateContext.Provider value={value}>
      {children}
    </ExplorerStateContext.Provider>
  );
}

ExplorerStateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useExplorerState = () => useContext(ExplorerStateContext);
