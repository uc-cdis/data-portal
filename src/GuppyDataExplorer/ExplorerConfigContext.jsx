import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { tierAccessLimit, explorerConfig } from '../localconf';
import './typedef';

/** @type {React.Context<AlteredExplorerConfig>} */
const ExplorerConfigContext = createContext(null);

export function ExplorerConfigProvider({ children, explorerId }) {
  const config = explorerConfig.find(({ id }) => id === explorerId);
  return (
    <ExplorerConfigContext.Provider
      value={{
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
      }}
    >
      {children}
    </ExplorerConfigContext.Provider>
  );
}

ExplorerConfigProvider.propTypes = {
  children: PropTypes.node.isRequired,
  explorerId: PropTypes.number.isRequired,
};

export const useExplorerConfig = () => useContext(ExplorerConfigContext);
