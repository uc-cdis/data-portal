import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import Dashboard from '../Layout/Dashboard';
import GuppyWrapper from '../GuppyComponents/GuppyWrapper';
import { useExplorerConfig } from './ExplorerConfigContext';
import ExplorerErrorBoundary from './ExplorerErrorBoundary';
import ExplorerSelect from './ExplorerSelect';
import ExplorerVisualization from './ExplorerVisualization';
import ExplorerFilter from './ExplorerFilter';
import ExplorerFilterSet from './ExplorerFilterSet';
import { extractExplorerStateFromURL } from './utils';
import './GuppyDataExplorer.css';
import './typedef';

/** @type {{ [x:string]: OptionFilter }} */
const emptyAdminAppliedPreFilters = {};

/** @param {{ dataVersion: string }} props */
function GuppyDataExplorer({ dataVersion }) {
  const {
    explorerId,
    current: {
      adminAppliedPreFilters = emptyAdminAppliedPreFilters,
      chartConfig,
      filterConfig,
      guppyConfig,
      patientIdsConfig,
      tableConfig,
    },
  } = useExplorerConfig();
  const history = useHistory();
  const initialState = extractExplorerStateFromURL(
    new URLSearchParams(history.location.search),
    filterConfig,
    patientIdsConfig
  );
  const isBrowserNavigation = useRef(false);
  const [state, setState] = useState(initialState);

  useEffect(() => {
    window.onpopstate = () => {
      isBrowserNavigation.current = true;
      const newState = extractExplorerStateFromURL(
        new URLSearchParams(history.location.search),
        filterConfig,
        patientIdsConfig
      );
      setState(newState);
      isBrowserNavigation.current = false;
    };
    return () => {
      window.onpopstate = () => {};
    };
  }, []);

  /** @param {FilterState} filter */
  function handleFilterChange(filter) {
    const searchParams = new URLSearchParams(history.location.search);
    searchParams.delete('filter');

    if (filter && Object.keys(filter).length > 0) {
      /** @type {string[]} */
      const allSearchFields = [];
      for (const { searchFields } of filterConfig.tabs)
        if (searchFields?.length > 0) allSearchFields.push(...searchFields);

      if (allSearchFields.length === 0) {
        searchParams.set('filter', JSON.stringify(filter));
      } else {
        const allSearchFieldSet = new Set(allSearchFields);
        const filterWithoutSearchFields = {};
        for (const field of Object.keys(filter))
          if (!allSearchFieldSet.has(field))
            filterWithoutSearchFields[field] = filter[field];

        if (Object.keys(filterWithoutSearchFields).length > 0)
          searchParams.set('filter', JSON.stringify(filterWithoutSearchFields));
      }
    }

    if (!isBrowserNavigation.current)
      history.push({
        search: decodeURIComponent(searchParams.toString()),
        state: { scrollY: window.scrollY },
      });
  }

  /** @param {string[]} patientIds */
  function handlePatientIdsChange(patientIds) {
    if (patientIdsConfig?.filter === undefined) return;

    const searchParams = new URLSearchParams(history.location.search);
    searchParams.delete('patientIds');

    if (patientIds.length > 0)
      searchParams.set('patientIds', patientIds.join(','));

    setState((prevState) => ({ ...prevState, patientIds }));
    if (!isBrowserNavigation.current)
      history.push({ search: decodeURIComponent(searchParams.toString()) });
  }

  /** @param {{ filters: FilterState }} args */
  function updateInitialAppliedFilters({ filters }) {
    setState((prevState) => ({
      ...prevState,
      initialAppliedFilters: filters,
    }));
  }

  function clearFilters() {
    setState((prevState) => ({ ...prevState, initialAppliedFilters: {} }));
  }

  return (
    <ExplorerErrorBoundary>
      <GuppyWrapper
        key={explorerId}
        adminAppliedPreFilters={adminAppliedPreFilters}
        initialAppliedFilters={state.initialAppliedFilters}
        chartConfig={chartConfig}
        filterConfig={filterConfig}
        guppyConfig={guppyConfig}
        onFilterChange={handleFilterChange}
        rawDataFields={tableConfig.fields}
        patientIds={state.patientIds}
      >
        {(data) => (
          <Dashboard>
            <Dashboard.Sidebar className='explorer__sidebar'>
              <ExplorerSelect />
              <ExplorerFilterSet
                className='explorer__filter-set'
                onOpenFilterSet={updateInitialAppliedFilters}
                onDeleteFilterSet={updateInitialAppliedFilters}
                filter={data.filter}
              />
              <ExplorerFilter
                className='explorer__filter'
                initialAppliedFilters={state.initialAppliedFilters}
                onFilterClear={clearFilters}
                onPatientIdsChange={handlePatientIdsChange}
                patientIds={state.patientIds}
                filter={data.filter}
                initialTabsOptions={data.initialTabsOptions}
                onAnchorValueChange={data.onAnchorValueChange}
                onFilterChange={data.onFilterChange}
                tabsOptions={data.tabsOptions}
              />
              <div className='explorer__data-release-version'>
                <span>Data release version:</span> {dataVersion}
              </div>
            </Dashboard.Sidebar>
            <Dashboard.Main>
              <ExplorerVisualization
                className='explorer__visualization'
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
                getTotalCountsByTypeAndFilter={
                  data.getTotalCountsByTypeAndFilter
                }
              />
            </Dashboard.Main>
          </Dashboard>
        )}
      </GuppyWrapper>
    </ExplorerErrorBoundary>
  );
}

GuppyDataExplorer.propTypes = {
  dataVersion: PropTypes.string,
};

const mapStateToProps = (state) => ({
  dataVersion: state.versionInfo.dataVersion,
});

export default connect(mapStateToProps)(GuppyDataExplorer);
