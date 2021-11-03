import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { tierAccessLimit, explorerConfig } from '../localconf';
import { capitalizeFirstLetter } from '../utils';
import './typedef';

/**
 * @typedef {Object} ExplorerConfigContext
 * @property {AlteredExplorerConfig} current
 * @property {number} explorerId
 * @property {{ label: string; value: string }[]} explorerOptions
 * @property {(id: number) => void} updateExplorerId
 */

/** @type {React.Context<ExplorerConfigContext>} */
const ExplorerConfigContext = createContext(null);

export function ExplorerConfigProvider({ children }) {
  const history = useHistory();

  const explorerOptions = [];
  const explorerIds = [];
  for (const { guppyConfig, id, label } of explorerConfig) {
    explorerIds.push(id);
    explorerOptions.push({
      label: capitalizeFirstLetter(label || guppyConfig.dataType),
      value: String(id),
    });
  }

  const searchParams = new URLSearchParams(history.location.search);
  const searchParamId = searchParams.has('id')
    ? Number(searchParams.get('id'))
    : undefined;
  const isSearchParamIdValid = explorerIds.includes(searchParamId);
  const initialExplorerId = isSearchParamIdValid
    ? searchParamId
    : explorerIds[0];
  useEffect(() => {
    if (!searchParams.has('id') || !isSearchParamIdValid)
      history.push({ search: `id=${initialExplorerId}` });
  }, []);

  const [explorerId, setExporerId] = useState(initialExplorerId);
  function updateExplorerId(id) {
    setExporerId(id);
    history.push({ search: `id=${id}` });
  }
  useEffect(() => {
    function handleBrowserNavigationForConfig() {
      const newSearchParam = new URLSearchParams(history.location.search);
      const newSearchParamId = Number(newSearchParam.get('id'));
      setExporerId(newSearchParamId);
    }
    window.addEventListener('popstate', handleBrowserNavigationForConfig);
    return () => {
      window.removeEventListener('popstate', handleBrowserNavigationForConfig);
    };
  }, []);

  const config = explorerConfig.find(({ id }) => id === explorerId);

  return (
    <ExplorerConfigContext.Provider
      value={{
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
          filterConfig: config.filters,
          getAccessButtonLink: config.getAccessButtonLink,
          guppyConfig: config.guppyConfig,
          hideGetAccessButton: config.hideGetAccessButton,
          patientIdsConfig: config.patientIds,
          survivalAnalysisConfig: config.survivalAnalysis,
          tableConfig: config.table,
          tierAccessLimit,
        },
        explorerId,
        explorerOptions,
        updateExplorerId,
      }}
    >
      {children}
    </ExplorerConfigContext.Provider>
  );
}

ExplorerConfigProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useExplorerConfig = () => useContext(ExplorerConfigContext);
