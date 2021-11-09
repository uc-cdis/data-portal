import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { explorerConfig } from '../localconf';
import Dashboard from '../Layout/Dashboard';
import GuppyWrapper from '../GuppyComponents/GuppyWrapper';
import {
  ExplorerConfigProvider,
  useExplorerConfig,
} from './ExplorerConfigContext';
import {
  ExplorerStateProvider,
  useExplorerState,
} from './ExplorerStateContext';
import ExplorerErrorBoundary from './ExplorerErrorBoundary';
import ExplorerSelect from './ExplorerSelect';
import ExplorerVisualization from './ExplorerVisualization';
import ExplorerFilter from './ExplorerFilter';
import ExplorerFilterSet from './ExplorerFilterSet';
import './Explorer.css';
import './typedef';

/** @type {{ [x:string]: OptionFilter }} */
const emptyAdminAppliedPreFilters = {};

/** @param {{ dataVersion?: string; portalVersion?: string }} props */
function ExplorerDashboard({ dataVersion, portalVersion }) {
  const {
    current: {
      adminAppliedPreFilters = emptyAdminAppliedPreFilters,
      chartConfig,
      filterConfig,
      guppyConfig,
      tableConfig,
    },
    explorerId,
    handleBrowserNavigationForConfig,
  } = useExplorerConfig();
  const {
    initialAppliedFilters,
    patientIds,
    handleBrowserNavigationForState,
    handleFilterChange,
  } = useExplorerState();
  useEffect(() => {
    window.addEventListener('popstate', handleBrowserNavigationForConfig);
    window.addEventListener('popstate', handleBrowserNavigationForState);
    return () => {
      window.removeEventListener('popstate', handleBrowserNavigationForConfig);
      window.removeEventListener('popstate', handleBrowserNavigationForState);
    };
  }, []);

  return (
    <GuppyWrapper
      key={explorerId}
      adminAppliedPreFilters={adminAppliedPreFilters}
      initialAppliedFilters={initialAppliedFilters}
      chartConfig={chartConfig}
      filterConfig={filterConfig}
      guppyConfig={guppyConfig}
      onFilterChange={handleFilterChange}
      rawDataFields={tableConfig.fields}
      patientIds={patientIds}
    >
      {(data) => (
        <Dashboard>
          <Dashboard.Sidebar className='explorer__sidebar'>
            <div>
              <ExplorerSelect />
              <ExplorerFilterSet
                className='explorer__filter-set'
                filter={data.filter}
              />
              <ExplorerFilter
                className='explorer__filter'
                filter={data.filter}
                initialTabsOptions={data.initialTabsOptions}
                onAnchorValueChange={data.onAnchorValueChange}
                onFilterChange={data.onFilterChange}
                tabsOptions={data.tabsOptions}
              />
            </div>
            <div className='explorer__version-info-area'>
              {dataVersion !== '' && (
                <div className='explorer__version-info'>
                  <span>Data Release Version:</span> {dataVersion}
                </div>
              )}
              {portalVersion !== '' && (
                <div className='explorer__version-info'>
                  <span>Portal Version:</span> {portalVersion}
                </div>
              )}
            </div>
          </Dashboard.Sidebar>
          <Dashboard.Main className='explorer__main'>
            <ExplorerVisualization
              accessibleCount={data.accessibleCount}
              aggsData={data.aggsData}
              aggsChartData={data.aggsChartData}
              allFields={data.allFields}
              filter={data.filter}
              isLoadingAggsData={data.isLoadingAggsData}
              isLoadingRawData={data.isLoadingRawData}
              rawData={data.rawData}
              totalCount={data.totalCount}
              downloadRawData={data.downloadRawData}
              downloadRawDataByFields={data.downloadRawDataByFields}
              downloadRawDataByTypeAndFilter={
                data.downloadRawDataByTypeAndFilter
              }
              fetchAndUpdateRawData={data.fetchAndUpdateRawData}
              getTotalCountsByTypeAndFilter={data.getTotalCountsByTypeAndFilter}
            />
          </Dashboard.Main>
        </Dashboard>
      )}
    </GuppyWrapper>
  );
}

ExplorerDashboard.propTypes = {
  dataVersion: PropTypes.string,
  portalVersion: PropTypes.string,
};

const mapStateToProps = ({ versionInfo }) => versionInfo;
const ReduxExplorerDashboard = connect(mapStateToProps)(ExplorerDashboard);

export default function Explorer() {
  return explorerConfig.length === 0 ? null : (
    <ExplorerConfigProvider>
      <ExplorerStateProvider>
        <ExplorerErrorBoundary>
          <ReduxExplorerDashboard />
        </ExplorerErrorBoundary>
      </ExplorerStateProvider>
    </ExplorerConfigProvider>
  );
}
