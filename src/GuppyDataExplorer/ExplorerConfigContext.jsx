import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useSearchParams } from 'react-router-dom';
import { explorerConfig } from '../localconf';
import { capitalizeFirstLetter } from '../utils';
import { createFilterInfo, isSurvivalAnalysisEnabled } from './utils';

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
  const location = useLocation();

  const explorerOptions = [];
  const explorerIds = [];
  for (const { guppyConfig, id, label } of explorerConfig) {
    explorerIds.push(id);
    explorerOptions.push({
      label: capitalizeFirstLetter(label || guppyConfig.dataType),
      value: String(id),
    });
  }

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
    if (!hasValidInitialSearchParamId) {
      setSearchParams(
        // @ts-ignore
        location.state?.keepSearch === true
          ? `id=${initialExplorerId}&${location.search.slice(1)}`
          : `id=${initialExplorerId}`,
        { replace: true }
      );
    }
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

  const config = explorerConfig.find(({ id }) => id === explorerId);

  const value = useMemo(
    () => ({
      current: {
        adminAppliedPreFilters: config.adminAppliedPreFilters,
        buttonConfig: {
          buttons: config.buttons,
          dropdowns: config.dropdowns,
          sevenBridgesExportURL: config.sevenBridgesExportURL,
          terraExportURL: config.terraExportURL,
          terraTemplate: config.terraTemplate,
        },
        chartConfig: config.charts,
        filterConfig: {
          ...config.filters,
          info: createFilterInfo(
            config.filters,
            config.guppyConfig.fieldMapping
          ),
        },
        getAccessButtonLink: config.getAccessButtonLink,
        guppyConfig: config.guppyConfig,
        hideGetAccessButton: config.hideGetAccessButton,
        patientIdsConfig: config.patientIds,
        survivalAnalysisConfig: {
          ...config.survivalAnalysis,
          enabled: isSurvivalAnalysisEnabled(config.survivalAnalysis),
        },
        tableConfig: config.table,
      },
      explorerId,
      explorerOptions,
      handleBrowserNavigationForConfig,
      updateExplorerId,
    }),
    [config, explorerId, explorerOptions]
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
