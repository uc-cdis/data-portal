import React from 'react';
import PropTypes from 'prop-types';
import GuppyWrapper from '../GuppyComponents/GuppyWrapper';
import ExplorerErrorBoundary from './ExplorerErrorBoundary';
import ExplorerVisualization from './ExplorerVisualization';
import ExplorerFilter from './ExplorerFilter';
import ExplorerTopMessageBanner from './ExplorerTopMessageBanner';
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
 * @property {string} nodeCountTitle
 * @property {import('history').History} history
 * @property {number} tierAccessLimit
 * @property {string} getAccessButtonLink
 * @property {boolean} hideGetAccessButton
 * @property {{ [x:string]: OptionFilter }} adminAppliedPreFilters
 */

/**
 * @typedef {Object} GuppyDataExplorerState
 * @property {FilterState} initialAppliedFilters
 * @property {string[]} patientIds
 */

/** @augments {React.Component<GuppyDataExplorerProps, GuppyDataExplorerState>} */
class GuppyDataExplorer extends React.Component {
  /** @param {GuppyDataExplorerProps} props */
  constructor(props) {
    super(props);

    const { initialAppliedFilters, patientIds } = extractExplorerStateFromURL(
      new URLSearchParams(props.history.location.search),
      props.filterConfig,
      props.filterConfig.anchor !== undefined,
      props.patientIdsConfig
    );
    /** @type {GuppyDataExplorerState} */
    this.state = {
      initialAppliedFilters,
      patientIds,
    };
    this._isMounted = false;
    this._isBrowserNavigation = false;
    this._hasAppliedFilters = Object.keys(initialAppliedFilters).length > 0;
  }

  componentDidMount() {
    this._isMounted = true;
    window.onpopstate = () => {
      this._isBrowserNavigation = true;
      const { initialAppliedFilters, patientIds } = extractExplorerStateFromURL(
        new URLSearchParams(this.props.history.location.search),
        this.props.filterConfig,
        this.props.filterConfig.anchor !== undefined,
        this.props.patientIdsConfig
      );
      this._hasAppliedFilters = Object.keys(initialAppliedFilters).length > 0;
      if (this._isMounted) this.setState({ initialAppliedFilters, patientIds });
      this._isBrowserNavigation = false;
    };
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  /** @param {FilterState} filter */
  handleFilterChange = (filter) => {
    const searchParams = new URLSearchParams(
      this.props.history.location.search
    );
    searchParams.delete('filter');

    if (filter && Object.keys(filter).length > 0) {
      this._hasAppliedFilters = true;
      /** @type {string[]} */
      const allSearchFields = [];
      for (const { searchFields } of this.props.filterConfig.tabs)
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
      this._hasAppliedFilters = false;
    }

    if (!this._isBrowserNavigation)
      this.props.history.push({
        search: Array.from(searchParams.entries(), (e) => e.join('=')).join(
          '&'
        ),
      });
  };

  handlePatientIdsChange = this.props.patientIdsConfig?.filter
    ? /** @param {string[]} patientIds */
      (patientIds) => {
        const searchParams = new URLSearchParams(
          this.props.history.location.search
        );
        searchParams.delete('patientIds');

        if (patientIds.length > 0)
          searchParams.set('patientIds', patientIds.join(','));

        this.setState({ patientIds });
        if (!this._isBrowserNavigation)
          this.props.history.push({
            search: Array.from(searchParams.entries(), (e) => e.join('=')).join(
              '&'
            ),
          });
      }
    : () => {};

  /** @param {{ filters: FilterState }} args */
  updateInitialAppliedFilters = ({ filters }) => {
    this._hasAppliedFilters = Object.keys(filters).length > 0;
    if (this._isMounted) this.setState({ initialAppliedFilters: filters });
  };

  clearFilters = () => {
    this._hasAppliedFilters = false;
    if (this._isMounted) this.setState({ initialAppliedFilters: {} });
  };

  render() {
    return (
      <ExplorerErrorBoundary>
        <div className='guppy-data-explorer'>
          <GuppyWrapper
            adminAppliedPreFilters={this.props.adminAppliedPreFilters}
            initialAppliedFilters={this.state.initialAppliedFilters}
            chartConfig={this.props.chartConfig}
            filterConfig={this.props.filterConfig}
            guppyConfig={this.props.guppyConfig}
            onFilterChange={this.handleFilterChange}
            rawDataFields={this.props.tableConfig.fields}
            patientIds={this.state.patientIds}
          >
            {(data) => (
              <>
                <ExplorerTopMessageBanner
                  className='guppy-data-explorer__top-banner'
                  getAccessButtonLink={this.props.getAccessButtonLink}
                  hideGetAccessButton={this.props.hideGetAccessButton}
                  accessibleCount={data.accessibleCount}
                  totalCount={data.totalCount}
                />
                <ExplorerFilterSet
                  className='guppy-data-explorer__filter-set'
                  onOpenFilterSet={this.updateInitialAppliedFilters}
                  onDeleteFilterSet={this.updateInitialAppliedFilters}
                  filter={data.filter}
                />
                <ExplorerFilter
                  adminAppliedPreFilters={this.props.adminAppliedPreFilters}
                  className='guppy-data-explorer__filter'
                  filterConfig={this.props.filterConfig}
                  guppyConfig={this.props.guppyConfig}
                  hasAppliedFilters={this._hasAppliedFilters}
                  initialAppliedFilters={this.state.initialAppliedFilters}
                  onFilterClear={this.clearFilters}
                  onPatientIdsChange={this.handlePatientIdsChange}
                  patientIds={this.state.patientIds}
                  tierAccessLimit={this.props.tierAccessLimit}
                  filter={data.filter}
                  initialTabsOptions={data.initialTabsOptions}
                  onAnchorValueChange={data.onAnchorValueChange}
                  onFilterChange={data.onFilterChange}
                  tabsOptions={data.tabsOptions}
                />
                <ExplorerVisualization
                  className='guppy-data-explorer__visualization'
                  chartConfig={this.props.chartConfig}
                  tableConfig={this.props.tableConfig}
                  survivalAnalysisConfig={this.props.survivalAnalysisConfig}
                  buttonConfig={this.props.buttonConfig}
                  guppyConfig={this.props.guppyConfig}
                  patientIdsConfig={this.props.patientIdsConfig}
                  nodeCountTitle={
                    this.props.guppyConfig.nodeCountTitle ||
                    capitalizeFirstLetter(this.props.guppyConfig.dataType)
                  }
                  tierAccessLimit={this.props.tierAccessLimit}
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
              </>
            )}
          </GuppyWrapper>
        </div>
      </ExplorerErrorBoundary>
    );
  }
}

GuppyDataExplorer.propTypes = {
  guppyConfig: GuppyConfigType.isRequired,
  filterConfig: FilterConfigType.isRequired,
  tableConfig: TableConfigType.isRequired,
  survivalAnalysisConfig: SurvivalAnalysisConfigType.isRequired,
  patientIdsConfig: PatientIdsConfigType,
  chartConfig: ChartConfigType.isRequired,
  buttonConfig: ButtonConfigType.isRequired,
  nodeCountTitle: PropTypes.string,
  history: PropTypes.object.isRequired,
  tierAccessLimit: PropTypes.number.isRequired,
  getAccessButtonLink: PropTypes.string,
  hideGetAccessButton: PropTypes.bool,
  adminAppliedPreFilters: PropTypes.object,
};

GuppyDataExplorer.defaultProps = {
  nodeCountTitle: undefined,
  getAccessButtonLink: undefined,
  hideGetAccessButton: false,
  adminAppliedPreFilters: {},
};

export default GuppyDataExplorer;
