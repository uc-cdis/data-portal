import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import SummaryChartGroup from '../../gen3-ui-component/components/charts/SummaryChartGroup';
import PercentageStackedBarChart from '../../gen3-ui-component/components/charts/PercentageStackedBarChart';
import Spinner from '../../gen3-ui-component/components/Spinner/Spinner';
import { components } from '../../params';
import DataSummaryCardGroup from '../../components/cards/DataSummaryCardGroup';
import ExplorerFindCohortButton from '../ExplorerFindCohortButton';
import ExplorerTable from '../ExplorerTable';
import ExplorerSurvivalAnalysis from '../ExplorerSurvivalAnalysis';
import ReduxExplorerButtonGroup from '../ExplorerButtonGroup/ReduxExplorerButtonGroup';
import {
  ButtonConfigType,
  ChartConfigType,
  GuppyConfigType,
  SurvivalAnalysisConfigType,
  TableConfigType,
  PatientIdsConfigType,
} from '../configTypeDef';
import './ExplorerVisualization.css';
import '../typedef';

/**
 * @typedef {Object} ViewContainerProps
 * @property {boolean} showIf
 * @property {React.ReactNode} children
 * @property {boolean} isLoading
 */

/** @param {ViewContainerProps} props */
function ViewContainer({ showIf, children, isLoading }) {
  const baseClassName = 'guppy-explorer-visualization__view';
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
  showIf: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  isLoading: PropTypes.bool,
};

/** @param {SurvivalAnalysisConfig} survivalAnalysisConfig */
function isSurvivalAnalysisEnabled(survivalAnalysisConfig) {
  if (survivalAnalysisConfig.result !== undefined)
    for (const resultOption of ['pval', 'risktable', 'survival'])
      if (survivalAnalysisConfig.result[resultOption]) return true;

  return false;
}

/**
 * @param {Object} args
 * @param {SimpleAggsData} args.aggsChartData
 * @param {ChartConfig} args.chartConfig
 * @param {FilterState} args.filter
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
      const { chartType: type, title } = chartConfig[field];
      const { histogram } = aggsChartData[field];
      switch (type) {
        case 'count':
          countItems.push({
            label: title,
            value: filter[field].selectedValues?.length || histogram.length,
          });
          break;
        case 'pie':
        case 'bar':
          summaries.push({
            type,
            title,
            data: histogram.map((i) => ({ name: i.key, value: i.count })),
          });
          break;
        case 'stackedBar':
          stackedBarCharts.push({
            type,
            title,
            data: histogram.map((i) => ({ name: i.key, value: i.count })),
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

/**
 * @typedef {Object} ExplorerVisualizationProps
 * @property {number} accessibleCount
 * @property {number} totalCount
 * @property {AggsData} aggsData
 * @property {AggsData} aggsChartData
 * @property {Object[]} rawData
 * @property {string[]} allFields
 * @property {FilterState} filter
 * @property {boolean} isLoadingAggsData
 * @property {boolean} isLoadingRawData
 * @property {(args: {  sort: GqlSort; format: string }) => Promise} downloadRawData
 * @property {(args: { fields: string[]; sort: GqlSort }) => Promise} downloadRawDataByFields
 * @property {(type: string, filter: FilterState, fields: string[]) => Promise} downloadRawDataByTypeAndFilter
 * @property {(type: string, filter: FilterState) => Promise} getTotalCountsByTypeAndFilter
 * @property {(args: { offset: number; size: number; sort: GqlSort }) => Promise} fetchAndUpdateRawData
 * @property {string} className
 * @property {ButtonConfig} buttonConfig
 * @property {ChartConfig} chartConfig
 * @property {GuppyConfig} guppyConfig
 * @property {SurvivalAnalysisConfig} survivalAnalysisConfig
 * @property {TableConfig} tableConfig
 * @property {PatientIdsConfig} patientIdsConfig
 * @property {string} nodeCountTitle
 * @property {number} tierAccessLimit
 */

/** @param {ExplorerVisualizationProps} props */
function ExplorerVisualization({
  accessibleCount = 0,
  totalCount = 0,
  aggsData = {},
  aggsChartData = {},
  rawData = [],
  allFields = [],
  filter = {},
  isLoadingAggsData = false,
  isLoadingRawData = false,
  downloadRawData = () => {},
  downloadRawDataByFields = () => {},
  downloadRawDataByTypeAndFilter = () => {},
  fetchAndUpdateRawData = () => {},
  getTotalCountsByTypeAndFilter = () => {},
  className = '',
  buttonConfig = {},
  chartConfig = {},
  guppyConfig = {},
  survivalAnalysisConfig = {},
  tableConfig = {},
  patientIdsConfig = {},
  nodeCountTitle,
  tierAccessLimit,
}) {
  const explorerViews = ['summary view'];
  if (tableConfig.enabled) explorerViews.push('table view');
  if (isSurvivalAnalysisEnabled(survivalAnalysisConfig))
    explorerViews.push('survival analysis');
  const [explorerView, setExplorerView] = useState(explorerViews[0]);

  const chartData = getChartData({
    aggsChartData,
    chartConfig,
    filter,
    nodeCountTitle,
    totalCount,
  });
  const isComponentLocked = accessibleCount === 0;
  const lockMessage = `The chart is hidden because you are exploring restricted access data and one or more of the values within the chart has a count below the access limit of ${tierAccessLimit} ${
    guppyConfig.nodeCountTitle.toLowerCase() || guppyConfig.dataType
  }.`;

  const history = useHistory();
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
    history,
    isLocked: isComponentLocked,
    isPending: isLoadingAggsData,
  };
  const tableColumnsOrdered =
    tableConfig.fields && tableConfig.fields.length > 0;
  const tableProps = {
    className: 'guppy-explorer-visualization__table',
    tableConfig: {
      fields: tableColumnsOrdered ? tableConfig.fields : allFields,
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
  const survivalProps = {
    aggsData,
    config: survivalAnalysisConfig,
    fieldMapping: guppyConfig.fieldMapping,
    filter,
  };

  return (
    <div className={className}>
      <div className='guppy-explorer-visualization__top'>
        <div className='guppy-explorer-visualization__view-group'>
          {explorerViews.map((view) => (
            <button
              key={view}
              className={explorerView === view ? 'active' : ''}
              onClick={() => setExplorerView(view)}
              type='button'
            >
              {view}
            </button>
          ))}
        </div>
        <div className='guppy-explorer-visualization__button-group'>
          {patientIdsConfig?.export && (
            <ExplorerFindCohortButton filter={filter} />
          )}
          <ReduxExplorerButtonGroup {...buttonGroupProps} />
        </div>
      </div>
      <ViewContainer
        showIf={explorerView === 'summary view'}
        isLoading={isLoadingAggsData}
      >
        {chartData.countItems.length > 0 && (
          <div className='guppy-explorer-visualization__summary-cards'>
            <DataSummaryCardGroup
              summaryItems={chartData.countItems}
              connected
            />
          </div>
        )}
        {chartData.summaries.length > 0 && (
          <div className='guppy-explorer-visualization__charts'>
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
          <div className='guppy-explorer-visualization__charts'>
            {chartData.stackedBarCharts.map((chart, i) => (
              <div key={i} className='guppy-explorer-visualization__charts-row'>
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
      {isSurvivalAnalysisEnabled(survivalAnalysisConfig) && (
        <ViewContainer showIf={explorerView === 'survival analysis'}>
          <ExplorerSurvivalAnalysis {...survivalProps} />
        </ViewContainer>
      )}
    </div>
  );
}

ExplorerVisualization.propTypes = {
  accessibleCount: PropTypes.number, // inherited from GuppyWrapper
  totalCount: PropTypes.number, // inherited from GuppyWrapper
  aggsData: PropTypes.object, // inherited from GuppyWrapper
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
  buttonConfig: ButtonConfigType,
  chartConfig: ChartConfigType,
  guppyConfig: GuppyConfigType,
  survivalAnalysisConfig: SurvivalAnalysisConfigType,
  tableConfig: TableConfigType,
  patientIdsConfig: PatientIdsConfigType,
  nodeCountTitle: PropTypes.string.isRequired,
  tierAccessLimit: PropTypes.number.isRequired,
};

export default ExplorerVisualization;
