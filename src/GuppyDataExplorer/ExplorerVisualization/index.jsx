import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SummaryChartGroup from '../../gen3-ui-component/components/charts/SummaryChartGroup';
import PercentageStackedBarChart from '../../gen3-ui-component/components/charts/PercentageStackedBarChart';
import Spinner from '../../components/Spinner';
import { useAppSelector } from '../../redux/hooks';
import { components, config } from '../../params';
import { capitalizeFirstLetter } from '../../utils';
import DataSummaryCardGroup from '../../components/cards/DataSummaryCardGroup';
import ExplorerRequestAccessButton from '../ExplorerRequestAccessButton';
import Popup from '../../components/Popup';
import ExplorerExploreExternalButton from '../ExplorerExploreExternalButton';
import ExplorerFilterSetWorkspace from '../ExplorerFilterSetWorkspace';
import ExplorerTable from '../ExplorerTable';
import ExplorerSurvivalAnalysis from '../ExplorerSurvivalAnalysis';
import ReduxExplorerButtonGroup from '../ExplorerButtonGroup/ReduxExplorerButtonGroup';
import './ExplorerVisualization.css';
import { FILTER_TYPE } from '../ExplorerFilterSetWorkspace/utils';

/** @typedef {import('../types').ChartConfig} ChartConfig */
/** @typedef {import('../types').ExplorerFilter} ExplorerFilter */
/** @typedef {import('../types').GqlSort} GqlSort */
/** @typedef {import('../types').SimpleAggsData} SimpleAggsData */

/**
 * @typedef {Object} ViewContainerProps
 * @property {boolean} showIf
 * @property {React.ReactNode} children
 * @property {boolean} [isLoading]
 */

/** @param {ViewContainerProps} props */
function ViewContainer({ showIf, children, isLoading }) {
  const baseClassName = 'explorer-visualization__view';
  return (
    <div className={baseClassName + (showIf ? '' : '--hidden')}>
      {isLoading && (
        <div className={`${baseClassName}__loading`}>
          <Spinner />
        </div>
      )}
      {children}
    </div>
  );
}

ViewContainer.propTypes = {
  showIf: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  isLoading: PropTypes.bool,
};

/**
 * @param {Object} args
 * @param {SimpleAggsData} args.aggsChartData
 * @param {ChartConfig} args.chartConfig
 * @param {ExplorerFilter} args.filter
 * @param {string} args.nodeCountTitle
 * @param {number} args.totalCount
 */
function getChartData({
  aggsChartData,
  chartConfig,
  filter,
  nodeCountTitle,
  totalCount,
}) {
  const summaries = [];
  const countItems = [{ label: nodeCountTitle, value: totalCount }];
  const stackedBarCharts = [];

  for (const field of Object.keys(chartConfig)) {
    if (aggsChartData[field]?.histogram !== undefined) {
      const { chartType: type, title, showPercentage } = chartConfig[field];
      const { histogram } = aggsChartData[field];
      switch (type) {
        case 'count': {
          const optionFilter = filter.value[field];
          countItems.push({
            label: title,
            value:
              optionFilter.__type === FILTER_TYPE.OPTION
                ? optionFilter.selectedValues.length
                : histogram.length,
          });
          break;
        }
        case 'pie':
        case 'bar':
          summaries.push({
            type,
            title,
            data: histogram.map((i) => ({
              name: /** @type {string} */ (i.key),
              value: i.count,
            })),
            showPercentage,
          });
          break;
        case 'stackedBar':
          stackedBarCharts.push({
            type,
            title,
            data: histogram.map((i) => ({
              name: /** @type {string} */ (i.key),
              value: i.count,
            })),
          });
          break;
        default:
          throw new Error(`Invalid chartType ${type}`);
      }
    }
  }

  // sort cout items according to appearence in chart config
  countItems.sort((a, b) => {
    const chartConfigValues = Object.values(chartConfig);
    const aIndex = chartConfigValues.findIndex((v) => v.title === a.label);
    const bIndex = chartConfigValues.findIndex((v) => v.title === b.label);
    // if one doesn't exist in chart config, put it to front
    if (aIndex === -1) return -1;
    if (bIndex === -1) return 1;
    return aIndex - bIndex;
  });

  return {
    summaries,
    countItems,
    stackedBarCharts,
  };
}

function openLink(link) {
  if (link) {
    let handle = window.open(link, '_blank', 'popup');
    handle.blur();
    window.focus();
  }
}

/**
 * @typedef {Object} ExplorerVisualizationProps
 * @property {number} accessibleCount
 * @property {number} totalCount
 * @property {SimpleAggsData} aggsChartData
 * @property {Object[]} rawData
 * @property {string[]} allFields
 * @property {ExplorerFilter} filter
 * @property {boolean} isLoadingAggsData
 * @property {boolean} isLoadingRawData
 * @property {(args: {  sort: GqlSort; format: string }) => Promise} downloadRawData
 * @property {(args: { fields: string[]; sort: GqlSort }) => Promise} downloadRawDataByFields
 * @property {(type: string, filter: ExplorerFilter, fields: string[]) => Promise} downloadRawDataByTypeAndFilter
 * @property {(type: string, filter: ExplorerFilter) => Promise} getTotalCountsByTypeAndFilter
 * @property {(args: { offset: number; size: number; sort: GqlSort }) => Promise} fetchAndUpdateRawData
 * @property {string} [className]
 */

/** @param {ExplorerVisualizationProps} props */
function ExplorerVisualization({
  accessibleCount = 0,
  totalCount = 0,
  aggsChartData = {},
  rawData = [],
  allFields = [],
  filter = {},
  isLoadingAggsData = false,
  isLoadingRawData = false,
  downloadRawData,
  downloadRawDataByFields,
  downloadRawDataByTypeAndFilter,
  fetchAndUpdateRawData,
  getTotalCountsByTypeAndFilter,
  className = '',
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isRequestAccessModalOpen, setRequestAccessModalOpen] = useState(false);

  const {
    buttonConfig,
    chartConfig,
    filterConfig,
    getAccessButtonLink,
    guppyConfig,
    hideGetAccessButton = false,
    patientIdsConfig,
    survivalAnalysisConfig,
    tableConfig,
  } = useAppSelector((state) => state.explorer.config);

  const nodeCountTitle =
    guppyConfig.nodeCountTitle || capitalizeFirstLetter(guppyConfig.dataType);

  const explorerViews = ['summary view'];
  if (tableConfig.enabled) explorerViews.push('table view');
  if (survivalAnalysisConfig.enabled) explorerViews.push('survival analysis');

  const explorerView = searchParams.get('view') ?? explorerViews[0];
  function updateExplorerView(view) {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('view', view);
    navigate(`?${decodeURIComponent(newSearchParams.toString())}`, {
      state: { scrollY: window.scrollY },
    });
  }
  useEffect(() => {
    if (!explorerViews.includes(explorerView))
      updateExplorerView(explorerViews[0]);
  }, []);

  const chartData = getChartData({
    aggsChartData,
    chartConfig,
    filter,
    nodeCountTitle,
    totalCount,
  });
  const isComponentLocked = accessibleCount === 0;
  const lockMessage =
    'The chart is hidden because you are exploring restricted access data and one or more of the values within the chart has a count below the access limit.';

  const buttonGroupProps = {
    buttonConfig,
    guppyConfig,
    accessibleCount,
    totalCount,
    downloadRawData,
    downloadRawDataByFields,
    downloadRawDataByTypeAndFilter,
    getTotalCountsByTypeAndFilter,
    filter,
    navigate,
    isLocked: isComponentLocked,
    isPending: isLoadingAggsData,
  };
  const tableColumnsOrdered =
    tableConfig.fields && tableConfig.fields.length > 0;
  const tableProps = {
    className: 'explorer-visualization__table',
    tableConfig: {
      fields: tableColumnsOrdered ? tableConfig.fields : allFields,
      filterInfo: filterConfig.info,
      ordered: tableColumnsOrdered,
      linkFields: tableConfig.linkFields || [],
    },
    fetchAndUpdateRawData,
    rawData,
    accessibleCount,
    totalCount,
    guppyConfig,
    isLocked: isComponentLocked,
  };
  const isDataRequestEnabled = config.dataRequests?.enabled ?? false;

  return (
    <div className={className}>
      <div className='explorer-visualization__top'>
        <div className='explorer-visualization__view-group'>
          {explorerViews.map((view) => (
            <button
              key={view}
              className={explorerView === view ? 'active' : ''}
              onClick={() => updateExplorerView(view)}
              type='button'
            >
              {view}
            </button>
          ))}
        </div>
        <div className='explorer-visualization__button-group'>
          {accessibleCount < totalCount && !hideGetAccessButton && (<>
            <ExplorerRequestAccessButton
              onClick={() => isDataRequestEnabled ? setRequestAccessModalOpen(true) : openLink(getAccessButtonLink) }
              tooltipText={
                accessibleCount === 0
                  ? 'You do not have permissions to view line-level data.'
                  : 'You have only limited access to line-level data.'
              }
            />
            {isRequestAccessModalOpen && 
              <Popup
                onClose={() => setRequestAccessModalOpen(false)}
                leftButtons={[{
                  caption: 'Back to Explore',
                  fn: () => setRequestAccessModalOpen(false)
                }]}
                rightButtons={[{
                  caption: 'Continue to Request',
                  fn: () => navigate('/requests/create')
                }]}
              >
                <div className='explorer-visualization__request-access-modal'>
                  Be sure to save the filter sets you want to use for your data request before continuing.
                </div>
              </Popup>
            }
          </>)}
          {patientIdsConfig?.export && (
            <ExplorerExploreExternalButton filter={filter} />
          )}
          <ReduxExplorerButtonGroup {...buttonGroupProps} />
        </div>
      </div>
      <ExplorerFilterSetWorkspace />
      <ViewContainer
        showIf={explorerView === 'summary view'}
        isLoading={isLoadingAggsData}
      >
        {chartData.countItems.length > 0 && (
          <div className='explorer-visualization__summary-cards'>
            <DataSummaryCardGroup
              summaryItems={chartData.countItems}
              connected
            />
          </div>
        )}
        {chartData.summaries.length > 0 && (
          <div className='explorer-visualization__charts'>
            <SummaryChartGroup
              summaries={chartData.summaries}
              lockMessage={lockMessage}
              barChartColor={components.categorical2Colors?.[0] || null}
              useCustomizedColorMap={!!components.categorical9Colors}
              customizedColorMap={components.categorical9Colors || []}
            />
          </div>
        )}
        {chartData.stackedBarCharts.length > 0 && (
          <div className='explorer-visualization__charts'>
            {chartData.stackedBarCharts.map((chart, i) => (
              <div key={i} className='explorer-visualization__charts-row'>
                {i > 0 && (
                  <div className='percentage-bar-chart__row-upper-border' />
                )}
                <PercentageStackedBarChart
                  key={i}
                  data={chart.data}
                  title={chart.title}
                  lockMessage={lockMessage}
                  useCustomizedColorMap={!!components.categorical9Colors}
                  customizedColorMap={components.categorical9Colors || []}
                />
              </div>
            ))}
          </div>
        )}
      </ViewContainer>
      {tableConfig.enabled && (
        <ViewContainer
          showIf={explorerView === 'table view'}
          isLoading={isLoadingRawData}
        >
          <ExplorerTable {...tableProps} />
        </ViewContainer>
      )}
      {survivalAnalysisConfig.enabled && (
        <ViewContainer showIf={explorerView === 'survival analysis'}>
          <ExplorerSurvivalAnalysis />
        </ViewContainer>
      )}
    </div>
  );
}

ExplorerVisualization.propTypes = {
  accessibleCount: PropTypes.number, // inherited from GuppyWrapper
  totalCount: PropTypes.number, // inherited from GuppyWrapper
  aggsChartData: PropTypes.object, // inherited from GuppyWrapper
  rawData: PropTypes.array, // inherited from GuppyWrapper
  allFields: PropTypes.array, // inherited from GuppyWrapper
  filter: PropTypes.object, // inherited from GuppyWrapper
  isLoadingAggsData: PropTypes.bool, // inherited from GuppyWrapper
  isLoadingRawData: PropTypes.bool, // inherited from GuppyWrapper
  downloadRawData: PropTypes.func, // inherited from GuppyWrapper
  downloadRawDataByFields: PropTypes.func, // inherited from GuppyWrapper
  downloadRawDataByTypeAndFilter: PropTypes.func, // inherited from GuppyWrapper
  fetchAndUpdateRawData: PropTypes.func, // inherited from GuppyWrapper
  getTotalCountsByTypeAndFilter: PropTypes.func, // inherited from GuppyWrapper
  className: PropTypes.string,
};

export default ExplorerVisualization;
