import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import GuppyWrapper from '../GuppyComponents/GuppyWrapper';
import ExplorerErrorBoundary from './ExplorerErrorBoundary';
import ExplorerVisualization from './ExplorerVisualization';
import ExplorerFilter from './ExplorerFilter';
import ExplorerFilterSet from './ExplorerFilterSet';
import { capitalizeFirstLetter } from '../utils';
import { validateFilter } from './utils';
import {
  GuppyConfigType,
  FilterConfigType,
  TableConfigType,
  ButtonConfigType,
  ChartConfigType,
  SurvivalAnalysisConfigType,
  PatientIdsConfigType,
} from './configTypeDef';
import './GuppyDataExplorer.css';
import './typedef';

/**
 * @param {URLSearchParams} searchParams
 * @param {FilterConfig} filterConfig
 * @param {boolean} isAnchorFilterEnabled
 * @param {PatientIdsConfig} [patientIdsConfig]
 */
function extractExplorerStateFromURL(
  searchParams,
  filterConfig,
  isAnchorFilterEnabled,
  patientIdsConfig
) {
  /** @type {FilterState} */
  let initialAppliedFilters = {};
  if (searchParams.has('filter'))
    try {
      const filterInUrl = JSON.parse(decodeURI(searchParams.get('filter')));
      if (validateFilter(filterInUrl, filterConfig, isAnchorFilterEnabled))
        initialAppliedFilters = filterInUrl;
      else throw new Error(undefined);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Invalid filter value in URL.', e);
    }

  // eslint-disable-next-line no-nested-ternary
  const patientIds = patientIdsConfig?.filter
    ? searchParams.has('patientIds')
      ? searchParams.get('patientIds').split(',')
      : []
    : undefined;

  return { initialAppliedFilters, patientIds };
}

/**
 * @typedef {Object} GuppyDataExplorerProps
 * @property {GuppyConfig} guppyConfig
 * @property {FilterConfig} filterConfig
 * @property {TableConfig} tableConfig
 * @property {SurvivalAnalysisConfig} survivalAnalysisConfig
 * @property {PatientIdsConfig} patientIdsConfig
 * @property {ChartConfig} chartConfig
 * @property {ButtonConfig} buttonConfig
 * @property {import('history').History} history
 * @property {number} tierAccessLimit
 * @property {string} getAccessButtonLink
 * @property {boolean} hideGetAccessButton
 * @property {{ [x:string]: OptionFilter }} adminAppliedPreFilters
 */

/** @type {{ [x:string]: OptionFilter }} */
const emptyAdminAppliedPreFilters = {};

/** @param {GuppyDataExplorerProps} props */
function GuppyDataExplorer({
  guppyConfig,
  filterConfig,
  tableConfig,
  survivalAnalysisConfig,
  patientIdsConfig,
  chartConfig,
  buttonConfig,
  history,
  tierAccessLimit,
  getAccessButtonLink,
  hideGetAccessButton = false,
  adminAppliedPreFilters = emptyAdminAppliedPreFilters,
}) {
  const initialState = extractExplorerStateFromURL(
    new URLSearchParams(history.location.search),
    filterConfig,
    filterConfig.anchor !== undefined,
    patientIdsConfig
  );
  const isMounted = useRef(false);
  const isBrowserNavigation = useRef(false);
  const hasAppliedFilters = useRef(
    Object.keys(initialState.initialAppliedFilters).length > 0
  );
  const [state, setState] = useState(initialState);

  useEffect(() => {
    isMounted.current = true;
    window.onpopstate = () => {
      isBrowserNavigation.current = true;
      const newState = extractExplorerStateFromURL(
        new URLSearchParams(history.location.search),
        filterConfig,
        filterConfig.anchor !== undefined,
        patientIdsConfig
      );
      hasAppliedFilters.current =
        Object.keys(newState.initialAppliedFilters).length > 0;
      if (isMounted.current) setState(newState);
      isBrowserNavigation.current = false;
    };
    return () => {
      isMounted.current = false;
    };
  }, []);

  /** @param {FilterState} filter */
  function handleFilterChange(filter) {
    const searchParams = new URLSearchParams(history.location.search);
    searchParams.delete('filter');

    if (filter && Object.keys(filter).length > 0) {
      hasAppliedFilters.current = true;
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
    } else {
      hasAppliedFilters.current = false;
    }

    if (!isBrowserNavigation.current)
      history.push(
        {
          search: Array.from(searchParams.entries(), (e) => e.join('=')).join(
            '&'
          ),
        },
        { scrollY: window.scrollY }
      );
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
      history.push({
        search: Array.from(searchParams.entries(), (e) => e.join('=')).join(
          '&'
        ),
      });
  }

  /** @param {{ filters: FilterState }} args */
  function updateInitialAppliedFilters({ filters }) {
    hasAppliedFilters.current = Object.keys(filters).length > 0;
    if (isMounted.current)
      setState((prevState) => ({
        ...prevState,
        initialAppliedFilters: filters,
      }));
  }

  function clearFilters() {
    hasAppliedFilters.current = false;
    if (isMounted.current)
      setState((prevState) => ({ ...prevState, initialAppliedFilters: {} }));
  }

  return (
    <ExplorerErrorBoundary>
      <div className='guppy-data-explorer'>
        <GuppyWrapper
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
            <>
              <ExplorerFilterSet
                className='guppy-data-explorer__filter-set'
                onOpenFilterSet={updateInitialAppliedFilters}
                onDeleteFilterSet={updateInitialAppliedFilters}
                filter={data.filter}
              />
              <ExplorerFilter
                adminAppliedPreFilters={adminAppliedPreFilters}
                className='guppy-data-explorer__filter'
                filterConfig={filterConfig}
                guppyConfig={guppyConfig}
                hasAppliedFilters={hasAppliedFilters.current}
                initialAppliedFilters={state.initialAppliedFilters}
                onFilterClear={clearFilters}
                onPatientIdsChange={handlePatientIdsChange}
                patientIds={state.patientIds}
                tierAccessLimit={tierAccessLimit}
                filter={data.filter}
                initialTabsOptions={data.initialTabsOptions}
                onAnchorValueChange={data.onAnchorValueChange}
                onFilterChange={data.onFilterChange}
                tabsOptions={data.tabsOptions}
              />
              <ExplorerVisualization
                className='guppy-data-explorer__visualization'
                chartConfig={chartConfig}
                tableConfig={tableConfig}
                survivalAnalysisConfig={survivalAnalysisConfig}
                buttonConfig={buttonConfig}
                guppyConfig={guppyConfig}
                patientIdsConfig={patientIdsConfig}
                nodeCountTitle={
                  guppyConfig.nodeCountTitle ||
                  capitalizeFirstLetter(guppyConfig.dataType)
                }
                tierAccessLimit={tierAccessLimit}
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
                getAccessButtonLink={getAccessButtonLink}
                hideGetAccessButton={hideGetAccessButton}
              />
            </>
          )}
        </GuppyWrapper>
      </div>
    </ExplorerErrorBoundary>
  );
}

GuppyDataExplorer.propTypes = {
  guppyConfig: GuppyConfigType.isRequired,
  filterConfig: FilterConfigType.isRequired,
  tableConfig: TableConfigType.isRequired,
  survivalAnalysisConfig: SurvivalAnalysisConfigType.isRequired,
  patientIdsConfig: PatientIdsConfigType,
  chartConfig: ChartConfigType.isRequired,
  buttonConfig: ButtonConfigType.isRequired,
  history: PropTypes.object.isRequired,
  tierAccessLimit: PropTypes.number.isRequired,
  getAccessButtonLink: PropTypes.string,
  hideGetAccessButton: PropTypes.bool,
  adminAppliedPreFilters: PropTypes.object,
};

export default GuppyDataExplorer;
