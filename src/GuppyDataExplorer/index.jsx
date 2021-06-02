import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import GuppyDataExplorer from './GuppyDataExplorer';
import { guppyUrl, tierAccessLimit, explorerConfig } from '../localconf';
import { capitalizeFirstLetter } from '../utils';
import './GuppyExplorer.css';

export default function Explorer() {
  if (explorerConfig.legnth === 0) {
    return null;
  }

  const history = useHistory();
  const isFilesPage = history.location.pathname === '/files';
  const fileTabIndex = explorerConfig.findIndex(
    ({ guppyConfig }) => guppyConfig?.dataType === 'file'
  );
  if (isFilesPage && fileTabIndex === -1) {
    return null;
  }

  const [tabIndex, setTabIndex] = useState(isFilesPage ? fileTabIndex : 0);
  const tabConfig = explorerConfig[tabIndex];
  const isMultiTabExplorer = explorerConfig.length > 1;

  return (
    <div className='guppy-explorer'>
      {isMultiTabExplorer && (
        <div className='guppy-explorer__tabs'>
          {explorerConfig.map(({ tabTitle, guppyConfig }, index) => (
            <div
              key={index}
              className={'guppy-explorer__tab'.concat(
                tabIndex === index ? ' guppy-explorer__tab--selected' : ''
              )}
              onClick={() => setTabIndex(index)}
              role='button'
              tabIndex={0}
            >
              <h3>
                {tabTitle ||
                  (guppyConfig?.dataType
                    ? capitalizeFirstLetter(guppyConfig.dataType)
                    : '')}
              </h3>
            </div>
          ))}
        </div>
      )}
      <div className={isMultiTabExplorer ? 'guppy-explorer__main' : ''}>
        <GuppyDataExplorer
          adminAppliedPreFilters={tabConfig.adminAppliedPreFilters}
          chartConfig={tabConfig.charts}
          filterConfig={tabConfig.filters}
          tableConfig={tabConfig.table}
          survivalAnalysisConfig={tabConfig.survivalAnalysis}
          patientIdsConfig={tabConfig.patientIds}
          guppyConfig={{
            path: guppyUrl,
            ...tabConfig.guppyConfig,
          }}
          buttonConfig={{
            buttons: tabConfig.buttons,
            dropdowns: tabConfig.dropdowns,
            terraExportURL: tabConfig.terraExportURL,
            terraTemplate: tabConfig.terraTemplate,
            sevenBridgesExportURL: tabConfig.sevenBridgesExportURL,
          }}
          history={history}
          tierAccessLimit={tierAccessLimit}
          getAccessButtonLink={tabConfig.getAccessButtonLink}
          hideGetAccessButton={tabConfig.hideGetAccessButton}
          // the "fully uncontrolled component with a key" trick
          key={tabIndex}
        />
      </div>
    </div>
  );
}
