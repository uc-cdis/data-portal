import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
 * @property {() => void} handleBrowserNavigationForConfig
 * @property {boolean} shouldUpdateState
 * @property {(v: boolean) => void} setShouldUpdateState
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

  const [initialExplorerId, hasValidInitialSearchParamId] = useMemo(() => {
    const searchParams = new URLSearchParams(history.location.search);
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
  const [shouldUpdateState, setShouldUpdateState] = useState(false);
  useEffect(() => {
    if (!hasValidInitialSearchParamId) {
      history.replace({
        search:
          // @ts-ignore
          history.location.state?.keepSearch === true
            ? `id=${initialExplorerId}&${history.location.search.slice(1)}`
            : `id=${initialExplorerId}`,
      });
      setShouldUpdateState(true);
    }
  }, []);

  const [explorerId, setExporerId] = useState(initialExplorerId);
  function updateExplorerId(id) {
    setExporerId(id);
    history.push({ search: `id=${id}` });
  }

  function handleBrowserNavigationForConfig() {
    const searchParams = new URLSearchParams(history.location.search);
    const searchParamId = Number(searchParams.get('id'));
    setExporerId(searchParamId);
  }

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
        handleBrowserNavigationForConfig,
        shouldUpdateState,
        setShouldUpdateState,
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
