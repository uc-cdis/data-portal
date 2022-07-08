import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import { explorerConfig } from '../localconf';
import { capitalizeFirstLetter } from '../utils';
import { getCurrentConfig } from './utils';

/** @type {number[]} */
const explorerIds = [];
/** @type {{ label: string; value: string }[]} */
const explorerOptions = [];
for (const { guppyConfig, id, label } of explorerConfig) {
  explorerIds.push(id);
  explorerOptions.push({
    label: capitalizeFirstLetter(label || guppyConfig.dataType),
    value: String(id),
  });
}

/** @typedef {import('./types').AlteredExplorerConfig} AlteredExplorerConfig */

/**
 * @typedef {Object} ExplorerConfigContext
 * @property {AlteredExplorerConfig} current
 * @property {number} explorerId
 * @property {{ label: string; value: string }[]} explorerOptions
 * @property {() => void} handleBrowserNavigationForConfig
 * @property {(id: number) => void} updateExplorerId
 */

/** @type {React.Context<ExplorerConfigContext>} */
const ExplorerConfigContext = createContext(null);

export function ExplorerConfigProvider({ children }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [initialExplorerId, hasValidInitialSearchParamId] = useMemo(() => {
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
    if (!hasValidInitialSearchParamId)
      setSearchParams(`id=${initialExplorerId}`);
  }, []);

  const [explorerId, setExporerId] = useState(initialExplorerId);
  function updateExplorerId(id) {
    setExporerId(id);
    setSearchParams(`id=${id}`);
  }

  function handleBrowserNavigationForConfig() {
    const searchParamId = Number(searchParams.get('id'));
    if (explorerIds.includes(searchParamId)) setExporerId(searchParamId);
  }

  const value = useMemo(
    () => ({
      current: getCurrentConfig(explorerId),
      explorerId,
      explorerOptions,
      handleBrowserNavigationForConfig,
      updateExplorerId,
    }),
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
