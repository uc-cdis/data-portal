import { createContext, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useExplorerConfig } from './ExplorerConfigContext';

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
  const {
    current: { filterConfig, patientIdsConfig },
  } = useExplorerConfig();

  /** @type {ExplorerFilter} */
  const initialExplorerFilter = {};
  const [explorerFilter, setExplorerFilter] = useState(initialExplorerFilter);

  /** @type {string[]} */
  const initielPatientIds = patientIdsConfig?.filter ? [] : undefined;
  const [patientIds, setPatientIds] = useState(initielPatientIds);

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
      handleBrowserNavigationForState() {},
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
