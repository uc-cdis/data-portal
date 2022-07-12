import { createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  createFilterSet,
  deleteFilterSet,
  fetchFilterSets,
  updateFilterSet,
} from '../redux/explorer/asyncThunks';
import { useFilterSetById } from '../redux/explorer/slice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

/** @typedef {import('./types').ExplorerFilterSet} ExplorerFilterSet */
/** @typedef {import('./types').ExplorerFilterSetDTO} ExplorerFilterSetDTO */

/** @returns {ExplorerFilterSet} */
function createEmptyFilterSet() {
  return { name: '', description: '', filter: {} };
}

/**
 * @typedef {Object} ExplorerFilterSetsContext
 * @property {ExplorerFilterSet} active
 * @property {ExplorerFilterSet[]} all
 * @property {ExplorerFilterSet} empty
 * @property {boolean} isError
 * @property {() => Promise<ExplorerFilterSet[] | void>} refresh
 * @property {(filerSet: ExplorerFilterSet) => Promise<ExplorerFilterSet>} create
 * @property {(filerSet: ExplorerFilterSet) => Promise<void>} delete
 * @property {(filerSet: ExplorerFilterSet) => Promise<void>} update
 * @property {(id?: number) => void} use
 */

/** @type {React.Context<ExplorerFilterSetsContext>} */
const ExplorerFilterSetsContext = createContext(null);

export function ExplorerFilterSetsProvider({ children }) {
  const dispatch = useAppDispatch();
  const { explorerId, filterSetActive, filterSets, filterSetsErrored } =
    useAppSelector((state) => state.explorer);

  function handleCatch(e) {
    console.error(e);
    return undefined;
  }

  const value = useMemo(
    () => ({
      active: filterSetActive,
      all: filterSets,
      empty: createEmptyFilterSet(),
      isError: filterSetsErrored,
      refresh: () => dispatch(fetchFilterSets()).unwrap().catch(handleCatch),
      create: (filterSet) =>
        dispatch(createFilterSet(filterSet)).unwrap().catch(handleCatch),
      delete: (filterSet) =>
        dispatch(deleteFilterSet(filterSet)).unwrap().catch(handleCatch),
      update: (filterSet) =>
        dispatch(updateFilterSet(filterSet)).unwrap().catch(handleCatch),
      use: (id) => {
        dispatch(useFilterSetById(id));
      },
    }),
    [explorerId, filterSetActive, filterSets, filterSetsErrored]
  );
  return (
    <ExplorerFilterSetsContext.Provider value={value}>
      {children}
    </ExplorerFilterSetsContext.Provider>
  );
}

ExplorerFilterSetsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useExplorerFilterSets = () =>
  useContext(ExplorerFilterSetsContext);
