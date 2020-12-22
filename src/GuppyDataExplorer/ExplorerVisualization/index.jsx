import React from 'react';
import PropTypes from 'prop-types';
import SummaryChartGroup from '../../gen3-ui-component/components/charts/SummaryChartGroup';
import PercentageStackedBarChart from '../../gen3-ui-component/components/charts/PercentageStackedBarChart';
import { components } from '../../params';
import { tierAccessLevel } from '../../localconf';
import DataSummaryCardGroup from '../../components/cards/DataSummaryCardGroup';
import ExplorerTable from '../ExplorerTable';
import ExplorerSurvivalAnalysis from '../ExplorerSurvivalAnalysis';
import ReduxExplorerButtonGroup from '../ExplorerButtonGroup/ReduxExplorerButtonGroup';
import {
  TableConfigType,
  ButtonConfigType,
  ChartConfigType,
  GuppyConfigType,
} from '../configTypeDef';
import { checkForAnySelectedUnaccessibleField } from '../GuppyDataExplorerHelper';
import './ExplorerVisualization.css';

function ViewContainer({ showIf, children }) {
  return <div style={showIf ? null : { display: 'none' }}>{children}</div>;
}

class ExplorerVisualization extends React.Component {
  constructor(props) {
    super(props);
    this.connectedFilter = React.createRef();

    const explorerViews = ['summary view'];
    if (props.tableConfig.enabled) explorerViews.push('table view');
    explorerViews.push('survival analysis');

    this.state = {
      explorerView: explorerViews[0],
      explorerViews,
    };
  }

  getData = (aggsData, chartConfig, filter) => {
    const summaries = [];
    let countItems = [];
    const stackedBarCharts = [];
    countItems.push({
      label: this.props.nodeCountTitle,
      value: this.props.totalCount,
    });
    Object.keys(chartConfig).forEach((field) => {
      if (!aggsData || !aggsData[`${field}`] || !aggsData[`${field}`].histogram)
        return;
      const { histogram } = aggsData[`${field}`];
      switch (chartConfig[`${field}`].chartType) {
        case 'count':
          countItems.push({
            label: chartConfig[`${field}`].title,
            value: filter[`${field}`]
              ? filter[`${field}`].selectedValues.length
              : aggsData[`${field}`].histogram.length,
          });
          break;
        case 'pie':
        case 'bar':
        case 'stackedBar': {
          const dataItem = {
            type: chartConfig[`${field}`].chartType,
            title: chartConfig[`${field}`].title,
            data: histogram.map((i) => ({ name: i.key, value: i.count })),
          };
          if (chartConfig[`${field}`].chartType === 'stackedBar') {
            stackedBarCharts.push(dataItem);
          } else {
            summaries.push(dataItem);
          }
          break;
        }
        default:
          throw new Error(
            `Invalid chartType ${chartConfig[`${field}`].chartType}`
          );
      }
    });
    // sort cout items according to appearence in chart config
    countItems = countItems.sort((a, b) => {
      const aIndex = Object.values(chartConfig).findIndex(
        (v) => v.title === a.label
      );
      const bIndex = Object.values(chartConfig).findIndex(
        (v) => v.title === b.label
      );
      // if one doesn't exist in chart config, put it to front
      if (aIndex === -1) return -1;
      if (bIndex === -1) return 1;
      return aIndex - bIndex;
    });
    return { summaries, countItems, stackedBarCharts };
  };

  render() {
    const chartData = this.getData(
      this.props.aggsData,
      this.props.chartConfig,
      this.props.filter
    );
    const tableColumns =
      this.props.tableConfig.fields && this.props.tableConfig.fields.length > 0
        ? this.props.tableConfig.fields
        : this.props.allFields;
    // don't lock components for libre commons
    const isComponentLocked =
      tierAccessLevel !== 'regular'
        ? false
        : checkForAnySelectedUnaccessibleField(
            this.props.aggsData,
            this.props.accessibleFieldObject,
            this.props.guppyConfig.accessibleValidationField
          );
    const lockMessage = `The chart is hidden because you are exploring restricted access data and one or more of the values within the chart has a count below the access limit of ${
      this.props.tierAccessLimit
    } ${
      this.props.guppyConfig.nodeCountTitle.toLowerCase() ||
      this.props.guppyConfig.dataType
    }.`;
    const barChartColor = components.categorical2Colors
      ? components.categorical2Colors[0]
      : null;

    return (
      <div className={this.props.className}>
        <div className='guppy-explorer-visualization__top'>
          <div className='guppy-explorer-visualization__view-group'>
            {this.state.explorerViews.map((view) => (
              <button
                key={view}
                className={this.state.explorerView === view ? 'active' : ''}
                onClick={() => this.setState({ explorerView: view })}
              >
                {view}
              </button>
            ))}
          </div>
          <div className='guppy-explorer-visualization__button-group'>
            <ReduxExplorerButtonGroup
              buttonConfig={this.props.buttonConfig}
              guppyConfig={this.props.guppyConfig}
              totalCount={this.props.totalCount}
              downloadRawData={this.props.downloadRawData}
              downloadRawDataByFields={this.props.downloadRawDataByFields}
              getTotalCountsByTypeAndFilter={
                this.props.getTotalCountsByTypeAndFilter
              }
              downloadRawDataByTypeAndFilter={
                this.props.downloadRawDataByTypeAndFilter
              }
              filter={this.props.filter}
              history={this.props.history}
              isLocked={isComponentLocked}
              isPending={this.props.aggsDataIsLoading}
            />
          </div>
        </div>
        <ViewContainer showIf={this.state.explorerView === 'summary view'}>
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
                barChartColor={barChartColor}
                useCustomizedColorMap={!!components.categorical9Colors}
                customizedColorMap={components.categorical9Colors || []}
              />
            </div>
          )}
          {chartData.stackedBarCharts.length > 0 && (
            <div className='guppy-explorer-visualization__charts'>
              {chartData.stackedBarCharts.map((chart, i) => (
                <div
                  key={i}
                  className='guppy-explorer-visualization__charts-row'
                >
                  {i > 0 && (
                    <div className='percentage-bar-chart__row-upper-border' />
                  )}
                  {
                    <PercentageStackedBarChart
                      key={i}
                      data={chart.data}
                      title={chart.title}
                      lockMessage={lockMessage}
                      useCustomizedColorMap={!!components.categorical9Colors}
                      customizedColorMap={components.categorical9Colors || []}
                    />
                  }
                </div>
              ))}
            </div>
          )}
        </ViewContainer>
        {this.props.tableConfig.enabled && (
          <ViewContainer showIf={this.state.explorerView === 'table view'}>
            <ExplorerTable
              className='guppy-explorer-visualization__table'
              tableConfig={{
                fields: tableColumns,
                linkFields: this.props.tableConfig.linkFields || [],
              }}
              fetchAndUpdateRawData={this.props.fetchAndUpdateRawData}
              rawData={this.props.rawData}
              totalCount={this.props.totalCount}
              guppyConfig={this.props.guppyConfig}
              isLocked={isComponentLocked}
            />
          </ViewContainer>
        )}
        <ViewContainer showIf={this.state.explorerView === 'survival analysis'}>
          <ExplorerSurvivalAnalysis
            aggsData={this.props.aggsData}
            fieldMapping={this.props.guppyConfig.fieldMapping}
            filter={this.props.filter}
          />
        </ViewContainer>
      </div>
    );
  }
}

ExplorerVisualization.propTypes = {
  totalCount: PropTypes.number, // inherited from GuppyWrapper
  aggsData: PropTypes.object, // inherited from GuppyWrapper
  aggsDataIsLoading: PropTypes.bool, // inherited from GuppyWrapper
  filter: PropTypes.object, // inherited from GuppyWrapper
  fetchAndUpdateRawData: PropTypes.func, // inherited from GuppyWrapper
  downloadRawDataByFields: PropTypes.func, // inherited from GuppyWrapper
  downloadRawData: PropTypes.func, // inherited from GuppyWrapper
  getTotalCountsByTypeAndFilter: PropTypes.func, // inherited from GuppyWrapper
  downloadRawDataByTypeAndFilter: PropTypes.func, // inherited from GuppyWrapper
  rawData: PropTypes.array, // inherited from GuppyWrapper
  allFields: PropTypes.array, // inherited from GuppyWrapper
  accessibleFieldObject: PropTypes.object, // inherited from GuppyWrapper
  history: PropTypes.object.isRequired,
  className: PropTypes.string,
  chartConfig: ChartConfigType,
  tableConfig: TableConfigType,
  buttonConfig: ButtonConfigType,
  guppyConfig: GuppyConfigType,
  nodeCountTitle: PropTypes.string.isRequired,
  tierAccessLimit: PropTypes.number.isRequired,
};

ExplorerVisualization.defaultProps = {
  totalCount: 0,
  aggsData: {},
  aggsDataIsLoading: false,
  filter: {},
  fetchAndUpdateRawData: () => {},
  downloadRawDataByFields: () => {},
  downloadRawData: () => {},
  getTotalCountsByTypeAndFilter: () => {},
  downloadRawDataByTypeAndFilter: () => {},
  rawData: [],
  allFields: [],
  accessibleFieldObject: {},
  className: '',
  chartConfig: {},
  tableConfig: {},
  buttonConfig: {},
  guppyConfig: {},
};

export default ExplorerVisualization;
