import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useExplorerConfig } from './ExplorerConfigContext';
import { extractExplorerStateFromURL } from './utils';

/** @typedef {import('./types').ExplorerFilter} ExplorerFilter */

/**
 * @typedef {Object} ExplorerStateContext
 * @property {ExplorerFilter} explorerFilter
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
  const [explorerFilter, setExplorerFilter] = useState(
    initialState.explorerFilter
  );
  const [patientIds, setPatientIds] = useState(initialState.patientIds);
  useEffect(() => {
    if (shouldUpdateState) {
      const newState = extractExplorerStateFromURL(
        searchParams,
        filterConfig,
        patientIdsConfig
      );
      setExplorerFilter(newState.explorerFilter);
      setPatientIds(newState.patientIds);
      setShouldUpdateState(false);
    }
  }, [shouldUpdateState]);

  const isBrowserNavigation = useRef(false);
  useEffect(() => {
    if (isBrowserNavigation.current) {
      isBrowserNavigation.current = false;
      return;
    }
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('filter');
    newSearchParams.delete('patientIds');

    if (explorerFilter && Object.keys(explorerFilter).length > 0)
      newSearchParams.set('filter', JSON.stringify(explorerFilter));

    if (patientIds.length > 0)
      newSearchParams.set('patientIds', patientIds.join(','));

    navigate(`?${decodeURIComponent(newSearchParams.toString())}`, {
      state: { scrollY: window.scrollY },
    });
  }, [explorerFilter, patientIds]);

  function handleBrowserNavigationForState() {
    isBrowserNavigation.current = true;
    const newState = extractExplorerStateFromURL(
      new URL(document.URL).searchParams,
      filterConfig,
      patientIdsConfig
    );
    // batch to avoid double-triggering useEffect() above
    ReactDOM.unstable_batchedUpdates(() => {
      setExplorerFilter(newState.explorerFilter);
      setPatientIds(newState.patientIds);
    });
  }

  function handleFilterChange(/** @type {ExplorerFilter} */ filter) {
    let newFilter = /** @type {ExplorerFilter} */ ({});
    if (filter && Object.keys(filter).length > 0) {
      /** @type {string[]} */
      const allSearchFields = [];
      for (const { searchFields } of filterConfig.tabs)
        if (searchFields?.length > 0) allSearchFields.push(...searchFields);

      if (allSearchFields.length === 0) {
        newFilter = /** @type {ExplorerFilter} */ ({
          __combineMode: explorerFilter.__combineMode,
          ...filter,
        });
      } else {
        const allSearchFieldSet = new Set(allSearchFields);
        const filterWithoutSearchFields = /** @type {ExplorerFilter} */ ({});
        for (const field of Object.keys(filter))
          if (!allSearchFieldSet.has(field))
            filterWithoutSearchFields[field] = filter[field];

        if (Object.keys(filterWithoutSearchFields).length > 0)
          newFilter = /** @type {ExplorerFilter} */ ({
            __combineMode: explorerFilter.__combineMode,
            ...filterWithoutSearchFields,
          });
      }
    }
    setExplorerFilter(newFilter);
  }

  function handleFilterClear() {
    handleFilterChange(undefined);
  }

  function handlePatientIdsChange(/** @type {string[]} */ ids) {
    if (patientIdsConfig?.filter !== undefined) setPatientIds(ids);
  }

  const value = useMemo(
    () => ({
      explorerFilter,
      patientIds,
      handleBrowserNavigationForState,
      handleFilterChange,
      handleFilterClear,
      handlePatientIdsChange,
    }),
    [explorerFilter, patientIds]
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
