import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { contactEmail, explorerConfig } from '../localconf';
import ErrorBoundary from '../components/ErrorBoundary';
import Dashboard from '../Layout/Dashboard';
import GuppyWrapper from '../GuppyComponents/GuppyWrapper';
import NotFoundSVG from '../img/not-found.svg';
import { fetchFilterSets } from '../redux/explorer/asyncThunks';
import { updateExplorerFilter, useExplorerById } from '../redux/explorer/slice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import ExplorerSelect from './ExplorerSelect';
import ExplorerVisualization from './ExplorerVisualization';
import ExplorerFilter, { DisabledExplorerFilter } from './ExplorerFilter';
import './Explorer.css';
import { FILTER_TYPE } from './ExplorerFilterSetWorkspace/utils';

/** @typedef {import('../redux/types').RootState} RootState */
/** @typedef {import('./types').OptionFilter} OptionFilter */

/** @type {{ [x: string]: OptionFilter }} */
const emptyAdminAppliedPreFilters = {};

function ExplorerDashboard() {
  const dispatch = useAppDispatch();
  /** @param {RootState['explorer']['explorerFilter']} filter */
  function handleFilterChange(filter) {
    dispatch(updateExplorerFilter(filter));
  }
  const {
    config: {
      adminAppliedPreFilters = emptyAdminAppliedPreFilters,
      chartConfig,
      filterConfig,
      guppyConfig,
      tableConfig,
    },
    explorerFilter,
    explorerId,
    explorerIds,
    patientIds,
  } = useAppSelector((state) => state.explorer);
  useEffect(() => {
    // sync saved filter sets with explorer id state
    dispatch(fetchFilterSets()).unwrap().catch(console.error);
  }, [explorerId]);

  const { dataVersion, portalVersion } = useAppSelector(
    (state) => state.versionInfo
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const isSearchParamIdValid =
    searchParams.has('id') &&
    explorerIds.includes(Number(searchParams.get('id')));
  const searchParamId = useRef(undefined);
  searchParamId.current = isSearchParamIdValid
    ? Number(searchParams.get('id'))
    : explorerIds[0];
  useEffect(() => {
    // sync search param with explorer id state
    setSearchParams(`id=${searchParamId.current}`, { replace: true });
    if (explorerId !== searchParamId.current)
      dispatch(useExplorerById(searchParamId.current));

    function switchExplorerOnBrowserNavigation() {
      if (explorerIds.includes(searchParamId.current))
        dispatch(useExplorerById(searchParamId.current));
    }
    window.addEventListener('popstate', switchExplorerOnBrowserNavigation);
    return () =>
      window.removeEventListener('popstate', switchExplorerOnBrowserNavigation);
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
              {data.filter.__type === FILTER_TYPE.COMPOSED ? (
                <DisabledExplorerFilter className='explorer__filter' />
              ) : (
                <ExplorerFilter
                  anchorValue={data.anchorValue}
                  className='explorer__filter'
                  filter={data.filter}
                  initialTabsOptions={data.initialTabsOptions}
                  onAnchorValueChange={data.onAnchorValueChange}
                  onFilterChange={data.onFilterChange}
                  tabsOptions={data.tabsOptions}
                />
              )}
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
              <div className='explorer__version-info'>
                <span>Help:</span>{' '}
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              </div>
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

const fallbackElement = (
  <div className='explorer__error'>
    <h1>Error opening the Exploration page...</h1>
    <p>
      The Exploration page is not working correctly. Please try refreshing the
      page. If the problem continues, please contact the administrator (
      <a href={`mailto:${contactEmail}`}>{contactEmail}</a>) for more
      information.
    </p>
    <NotFoundSVG />
  </div>
);

export default function Explorer() {
  return explorerConfig.length === 0 ? null : (
    <ErrorBoundary fallback={fallbackElement}>
      <ExplorerDashboard />
    </ErrorBoundary>
  );
}
