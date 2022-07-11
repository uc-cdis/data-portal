import { createContext, useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateExplorerFilter,
  updatePatientIds,
} from '../redux/explorer/slice';

/** @typedef {import('../redux/types').RootState} RootState */

/**
 * @typedef {Object} ExplorerStateContext
 * @property {RootState['explorer']['explorerFilter']} explorerFilter
 * @property {string[]} patientIds
 * @property {(filter: RootState['explorer']['explorerFilter']) => void} handleFilterChange
 * @property {(patientIds: string[]) => void} handlePatientIdsChange
 */

/** @type {React.Context<ExplorerStateContext>} */
const ExplorerStateContext = createContext(null);

export function ExplorerStateProvider({ children }) {
  /** @type {import('../redux/types').AppDispatch} */
  const dispatch = useDispatch();
  const { explorerFilter, patientIds } = useSelector(
    (/** @type {RootState} */ state) => state.explorer
  );

  const location = useLocation();
  /** @param {RootState['explorer']['explorerFilter']} filter */
  function handleFilterChange(filter) {
    dispatch(updateExplorerFilter(filter));
  }
  useEffect(() => {
    /** @type {{ filter?: RootState['explorer']['explorerFilter'] }} */
    const { filter } = location.state ?? {};
    if (filter !== undefined) handleFilterChange(filter);
  }, []);

  /** @param {RootState['explorer']['patientIds']} ids */
  function handlePatientIdsChange(ids) {
    dispatch(updatePatientIds(ids));
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
