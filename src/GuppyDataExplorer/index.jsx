import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { explorerConfig } from '../localconf';
import ErrorBoundary from '../components/ErrorBoundary';
import Dashboard from '../Layout/Dashboard';
import GuppyWrapper from '../GuppyComponents/GuppyWrapper';
import NotFoundSVG from '../img/not-found.svg';
import {
  ExplorerConfigProvider,
  useExplorerConfig,
} from './ExplorerConfigContext';
import {
  ExplorerStateProvider,
  useExplorerState,
} from './ExplorerStateContext';
import { ExplorerFilterSetsProvider } from './ExplorerFilterSetsContext';
import ExplorerSelect from './ExplorerSelect';
import ExplorerVisualization from './ExplorerVisualization';
import ExplorerFilter from './ExplorerFilter';
import ExplorerFilterSet from './ExplorerFilterSet';
import './Explorer.css';

/** @typedef {import('./types').OptionFilter} OptionFilter */
/** @typedef {import('../types').VersionInfoState} VersionInfoState */

/** @type {{ [x: string]: OptionFilter }} */
const emptyAdminAppliedPreFilters = {};

/**
 * @param {Object} props
 * @param {VersionInfoState['dataVersion']} props.dataVersion
 * @param {string} props.portalVersion
 */
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
    explorerFilter,
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
      explorerFilter={explorerFilter}
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
                anchorValue={data.anchorValue}
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

/** @param {{ versionInfo: VersionInfoState }} state */
const mapStateToProps = ({ versionInfo }) => versionInfo;
const ReduxExplorerDashboard = connect(mapStateToProps)(ExplorerDashboard);

const fallbackElement = (
  <div className='explorer__error'>
    <h1>Error opening the Exploration page...</h1>
    <p>
      The Exploration page is not working correctly. Please try refreshing the
      page. If the problem continues, please contact the administrator (
      <a href='mailto:pcdc_help@lists.uchicago.edu'>
        pcdc_help@lists.uchicago.edu
      </a>
      ) for more information.
    </p>
    <NotFoundSVG />
  </div>
);

export default function Explorer() {
  return explorerConfig.length === 0 ? null : (
    <ErrorBoundary fallback={fallbackElement}>
      <ExplorerConfigProvider>
        <ExplorerStateProvider>
          <ExplorerFilterSetsProvider>
            <ReduxExplorerDashboard />
          </ExplorerFilterSetsProvider>
        </ExplorerStateProvider>
      </ExplorerConfigProvider>
    </ErrorBoundary>
  );
}
