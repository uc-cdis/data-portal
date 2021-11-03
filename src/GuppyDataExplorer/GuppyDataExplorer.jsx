import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dashboard from '../Layout/Dashboard';
import GuppyWrapper from '../GuppyComponents/GuppyWrapper';
import { useExplorerConfig } from './ExplorerConfigContext';
import { useExplorerState } from './ExplorerStateContext';
import ExplorerErrorBoundary from './ExplorerErrorBoundary';
import ExplorerSelect from './ExplorerSelect';
import ExplorerVisualization from './ExplorerVisualization';
import ExplorerFilter from './ExplorerFilter';
import ExplorerFilterSet from './ExplorerFilterSet';
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
      tableConfig,
    },
  } = useExplorerConfig();
  const {
    initialAppliedFilters,
    patientIds,
    handleFilterChange,
  } = useExplorerState();

  return (
    <ExplorerErrorBoundary>
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
