import { createContext, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useExplorerConfig } from './ExplorerConfigContext';

/** @typedef {import('./types').ExplorerFilter} ExplorerFilter */

/**
 * @typedef {Object} ExplorerStateContext
 * @property {ExplorerFilter} explorerFilter
 * @property {string[]} patientIds
 * @property {(filter: ExplorerFilter) => void} handleFilterChange
 * @property {(patientIds: string[]) => void} handlePatientIdsChange
 */

/** @type {React.Context<ExplorerStateContext>} */
const ExplorerStateContext = createContext(null);

export function ExplorerStateProvider({ children }) {
  const {
    current: { filterConfig, patientIdsConfig },
  } = useExplorerConfig();

  const initialExplorerFilter =
    /** @type {{ filter?: ExplorerFilter }} */ (useLocation().state)?.filter ??
    /** @type {ExplorerFilter} */ ({});
  const [explorerFilter, setExplorerFilter] = useState(initialExplorerFilter);
  function handleFilterChange(/** @type {ExplorerFilter} */ filter) {
    let newFilter = /** @type {ExplorerFilter} */ ({});
    if (filter && Object.keys(filter).length > 0) {
      const allSearchFieldSet = new Set();
      for (const { searchFields } of filterConfig.tabs)
        for (const field of searchFields ?? []) allSearchFieldSet.add(field);

      if (allSearchFieldSet.size === 0) {
        newFilter = /** @type {ExplorerFilter} */ ({
          __combineMode: explorerFilter.__combineMode,
          ...filter,
        });
      } else {
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

  /** @type {string[]} */
  const initielPatientIds = patientIdsConfig?.filter ? [] : undefined;
  const [patientIds, setPatientIds] = useState(initielPatientIds);
  function handlePatientIdsChange(/** @type {string[]} */ ids) {
    if (patientIdsConfig?.filter !== undefined) setPatientIds(ids);
  }

  const value = useMemo(
    () => ({
      explorerFilter,
      patientIds,
      handleFilterChange,
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
