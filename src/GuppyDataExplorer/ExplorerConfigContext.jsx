import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import { setExplorerId } from '../redux/explorer/slice';

/** @typedef {import('../redux/types').RootState} RootState */
/**
 * @typedef {Object} ExplorerConfigContext
 * @property {RootState['explorer']['config']} current
 * @property {number} explorerId
 * @property {(id: number) => void} updateExplorerId
 */

/** @type {React.Context<ExplorerConfigContext>} */
const ExplorerConfigContext = createContext(null);

export function ExplorerConfigProvider({ children }) {
  /** @type {import('../redux/types').AppDispatch} */
  const dispatch = useDispatch();
  const { config, explorerId, explorerIds } = useSelector(
    (/** @type {RootState} */ state) => state.explorer
  );
  const [searchParams, setSearchParams] = useSearchParams();
  function updateExplorerId(id) {
    dispatch(setExplorerId(id));
    setSearchParams(`id=${id}`);
  }

  const [initialSearchParamId, hasValidInitialSearchParamId] = useMemo(() => {
    const hasSearchParamId = searchParams.has('id');
    const searchParamId = hasSearchParamId
      ? Number(searchParams.get('id'))
      : undefined;
    const isSearchParamIdValid = explorerIds.includes(searchParamId);
    return [
      isSearchParamIdValid ? searchParamId : explorerIds[0],
      hasSearchParamId && isSearchParamIdValid,
    ];
  }, []);
  useEffect(() => {
    if (!hasValidInitialSearchParamId) {
      setSearchParams(`id=${initialSearchParamId}`);
      setExplorerId(initialSearchParamId);
    }
  }, []);

  const searchParamId = useRef(initialSearchParamId);
  searchParamId.current = Number(searchParams.get('id'));
  function switchExplorerOnBrowserNavigation() {
    if (explorerIds.includes(searchParamId.current))
      dispatch(setExplorerId(searchParamId.current));
  }
  useEffect(() => {
    window.addEventListener('popstate', switchExplorerOnBrowserNavigation);
    return () =>
      window.removeEventListener('popstate', switchExplorerOnBrowserNavigation);
  }, []);

  const value = useMemo(
    () => ({ current: config, explorerId, updateExplorerId }),
    [explorerId]
  );

  return (
    <ExplorerConfigContext.Provider value={value}>
      {children}
    </ExplorerConfigContext.Provider>
  );
}

ExplorerConfigProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useExplorerConfig = () => useContext(ExplorerConfigContext);
