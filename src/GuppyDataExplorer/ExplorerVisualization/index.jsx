import React from 'react';
import PropTypes from 'prop-types';
import GuppyWrapper from '@gen3/guppy/dist/components/GuppyWrapper';
import ConnectedFilter from '@gen3/guppy/dist/components/ConnectedFilter';
import SummaryChartGroup from '@gen3/ui-component/dist/components/charts/SummaryChartGroup';
import PercentageStackedBarChart from '@gen3/ui-component/dist/components/charts/PercentageStackedBarChart';
import { components } from '../../params';
import { guppyUrl, tierAccessLevel, tierAccessLimit } from '../../localconf';
import DataSummaryCardGroup from '../../components/cards/DataSummaryCardGroup';
import ExplorerHeatMap from '../ExplorerHeatMap';
import ExplorerTable from '../ExplorerTable';
import ReduxExplorerButtonGroup from '../ExplorerButtonGroup/ReduxExplorerButtonGroup';
import {
  TableConfigType,
  ButtonConfigType,
  ChartConfigType,
  GuppyConfigType,
} from '../configTypeDef';
import { checkForAnySelectedUnaccessibleField } from '../GuppyDataExplorerHelper';
import './ExplorerVisualization.css';
import { labelToPlural } from '../utils';

class ExplorerVisualization extends React.Component {
  constructor(props) {
    super(props);
    this.connectedFilter = React.createRef();
  }

  getData = (aggsData, chartConfig, filter) => {
    const summaries = [];
    let countItems = [];
    const stackedBarCharts = [];
    countItems.push({
      label: this.props.nodeCountTitle || labelToPlural(this.props.guppyConfig.dataType, true),
      value: this.props.totalCount,
    });
    Object.keys(chartConfig).forEach((field) => {
      // use `${field}` to handle nested fields, which contain '.'
      if (!aggsData || !aggsData[`${field}`] || !aggsData[`${field}`].histogram) return;
      const { histogram } = aggsData[`${field}`];
      switch (chartConfig[`${field}`].chartType) {
      case 'count':
        countItems.push({
          label: chartConfig[`${field}`].title,
          value: filter[`${field}`] ? filter[`${field}`].selectedValues.length
            : aggsData[`${field}`].histogram.length,
        });
        break;
      case 'pie':
      case 'fullPie':
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
        throw new Error(`Invalid chartType ${chartConfig[`${field}`].chartType}`);
      }
    });
    // sort cout items according to appearance in chart config
    countItems = countItems.sort((a, b) => {
      const aIndex = Object.values(chartConfig).findIndex((v) => v.title === a.label);
      const bIndex = Object.values(chartConfig).findIndex((v) => v.title === b.label);
      // if one doesn't exist in chart config, put it to front
      if (aIndex === -1) return -1;
      if (bIndex === -1) return 1;
      return aIndex - bIndex;
    });
    return { summaries, countItems, stackedBarCharts };
  }

  updateConnectedFilter = async (heatMapMainYAxisVar) => {
    const caseField = this.props.guppyConfig.manifestMapping.referenceIdFieldInDataIndex;
    let caseIDList;
    try {
      const res = await this.props.downloadRawDataByFields({ fields: [caseField] });
      caseIDList = res.map((e) => e[caseField]);
      this.heatMapIsLocked = false;
    } catch (e) {
      // when tiered access is enabled, we cannot get the list of IDs because
      // the user does not have access to all projects. In that case, the
      // heatmap is not displayed.
      caseIDList = [];
      this.heatMapIsLocked = true;
    }
    this.connectedFilter.current.setFilter(
      { [heatMapMainYAxisVar]: { selectedValues: caseIDList } },
    );
  };

  render() {
    const chartData = this.getData(this.props.aggsData, this.props.chartConfig, this.props.filter);
    const tableColumnsOrdered = (this.props.tableConfig.fields
      && this.props.tableConfig.fields.length > 0);
    const tableColumns = tableColumnsOrdered ? this.props.tableConfig.fields : this.props.allFields;
    // don't lock components for libre commons
    const isComponentLocked = (tierAccessLevel !== 'regular') ? false : checkForAnySelectedUnaccessibleField(this.props.aggsData,
      this.props.accessibleFieldObject, this.props.guppyConfig.accessibleValidationField);
    const lockMessage = `The chart is hidden because you are exploring restricted access data and one or more of the values within the chart has a count below the access limit of ${this.props.tierAccessLimit} ${
      this.props.guppyConfig.nodeCountTitle
        ? this.props.guppyConfig.nodeCountTitle.toLowerCase()
        : labelToPlural(this.props.guppyConfig.dataType)
    }.`;
    const barChartColor = components.categorical2Colors ? components.categorical2Colors[0] : null;

    // heatmap config
    const heatMapGuppyConfig = this.props.heatMapConfig
      ? this.props.heatMapConfig.guppyConfig : null;
    const heatMapMainYAxisVar = (this.props.heatMapConfig
      && this.props.guppyConfig.manifestMapping
      && this.props.guppyConfig.manifestMapping.referenceIdFieldInResourceIndex)
      ? this.props.guppyConfig.manifestMapping.referenceIdFieldInResourceIndex : null;
    const heatMapFilterConfig = {
      tabs: [
        {
          fields: [
            heatMapMainYAxisVar,
          ],
        },
      ],
    };
    if (heatMapGuppyConfig && this.connectedFilter.current) {
      this.updateConnectedFilter(heatMapMainYAxisVar);
    }

    return (
      <div className={this.props.className}>
        <div className='guppy-explorer-visualization__button-group' id='guppy-explorer-data-tools'>
          <ReduxExplorerButtonGroup
            buttonConfig={this.props.buttonConfig}
            guppyConfig={this.props.guppyConfig}
            totalCount={this.props.totalCount}
            downloadRawData={this.props.downloadRawData}
            downloadRawDataByFields={this.props.downloadRawDataByFields}
            getTotalCountsByTypeAndFilter={this.props.getTotalCountsByTypeAndFilter}
            downloadRawDataByTypeAndFilter={this.props.downloadRawDataByTypeAndFilter}
            filter={this.props.filter}
            history={this.props.history}
            location={this.props.location}
            isLocked={isComponentLocked}
            isPending={this.props.aggsDataIsLoading}
          />
        </div>
        {
          chartData.countItems.length > 0 && (
            <div className='guppy-explorer-visualization__summary-cards' id='guppy-explorer-summary-statistics'>
              <DataSummaryCardGroup summaryItems={chartData.countItems} connected />
            </div>
          )
        }
        {
          chartData.summaries.length > 0 && (
            <div className='guppy-explorer-visualization__charts'>
              <SummaryChartGroup
                summaries={chartData.summaries}
                lockMessage={lockMessage}
                barChartColor={barChartColor}
                useCustomizedColorMap={!!components.categorical9Colors}
                customizedColorMap={components.categorical9Colors || []}
              />
            </div>
          )
        }
        {
          chartData.stackedBarCharts.length > 0 && (
            <div className='guppy-explorer-visualization__charts'>
              {
                chartData.stackedBarCharts.map((chart, i) => (
                  <div key={i} className='guppy-explorer-visualization__charts-row'>
                    {
                      i > 0 && <div className='percentage-bar-chart__row-upper-border' />
                    }
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
                ),
                )
              }
            </div>
          )
        }
        {
          heatMapGuppyConfig && (
            <GuppyWrapper
              guppyConfig={{
                path: guppyUrl,
                type: heatMapGuppyConfig.dataType,
                ...heatMapGuppyConfig,
              }}
              filterConfig={heatMapFilterConfig}
              tierAccessLevel={tierAccessLevel}
              tierAccessLimit={tierAccessLimit}
            >
              <ConnectedFilter
                className='guppy-explorer-visualization__connected-filter--hide'
                ref={this.connectedFilter}
                guppyConfig={{
                  path: guppyUrl,
                  type: heatMapGuppyConfig.dataType,
                  ...heatMapGuppyConfig,
                }}
                filterConfig={heatMapFilterConfig}
              />
              <ExplorerHeatMap
                guppyConfig={{
                  path: guppyUrl,
                  type: heatMapGuppyConfig.dataType,
                  ...heatMapGuppyConfig,
                }}
                mainYAxisVar={heatMapMainYAxisVar}
                isLocked={this.heatMapIsLocked}
                lockMessage={'This chart is hidden because it contains data you do not have access to'}
              />
            </GuppyWrapper>
          )
        }
        {
          this.props.tableConfig.enabled && (
            <ExplorerTable
              className='guppy-explorer-visualization__table'
              tableConfig={{
                fields: tableColumns,
                ordered: tableColumnsOrdered,
                linkFields: this.props.tableConfig.linkFields || [],
                dicomViewerId: this.props.tableConfig.dicomViewerId,
              }}
              fetchAndUpdateRawData={this.props.fetchAndUpdateRawData}
              rawData={this.props.rawData}
              totalCount={this.props.totalCount}
              guppyConfig={this.props.guppyConfig}
              isLocked={isComponentLocked}
            />
          )
        }
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
  heatMapConfig: PropTypes.object,
  guppyConfig: GuppyConfigType,
  nodeCountTitle: PropTypes.string,
  tierAccessLimit: PropTypes.number.isRequired,
  location: PropTypes.object.isRequired,
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
  heatMapConfig: {},
  guppyConfig: {},
  nodeCountTitle: '',
};

export default ExplorerVisualization;
