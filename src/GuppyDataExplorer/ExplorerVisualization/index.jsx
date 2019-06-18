import React from 'react';
import PropTypes from 'prop-types';
import SummaryChartGroup from '@gen3/ui-component/dist/components/charts/SummaryChartGroup';
import PercentageStackedBarChart from '@gen3/ui-component/dist/components/charts/PercentageStackedBarChart';
import DataSummaryCardGroup from '../../components/cards/DataSummaryCardGroup';
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
import { components } from '../../params';

class ExplorerVisualization extends React.Component {
  getData = (aggsData, chartConfig, filter) => {
    const summaries = [];
    const countItems = [];
    const stackedBarCharts = [];
    countItems.push({
      label: this.props.nodeCountTitle,
      value: this.props.totalCount,
    });
    Object.keys(chartConfig).forEach((field) => {
      if (!aggsData || !aggsData[field] || !aggsData[field].histogram) return;
      const { histogram } = aggsData[field];
      switch (chartConfig[field].chartType) {
      case 'count':
        countItems.push({
          label: chartConfig[field].title,
          value: filter[field] ? filter[field].selectedValues.length
            : aggsData[field].histogram.length,
        });
        break;
      case 'pie':
      case 'bar':
      case 'stackedBar': {
        const dataItem = {
          type: chartConfig[field].chartType,
          title: chartConfig[field].title,
          data: histogram.map(i => ({ name: i.key, value: i.count })),
        };
        if (chartConfig[field].chartType === 'stackedBar') {
          stackedBarCharts.push(dataItem);
        } else {
          summaries.push(dataItem);
        }
        break;
      }
      default:
        throw new Error(`Invalid chartType ${chartConfig[field].chartType}`);
      }
    });
    return { summaries, countItems, stackedBarCharts };
  }

  render() {
    const chartData = this.getData(this.props.aggsData, this.props.chartConfig, this.props.filter);
    const tableColumns = (this.props.tableConfig.fields && this.props.tableConfig.fields.length > 0)
      ? this.props.tableConfig.fields : this.props.allFields;
    const isComponentLocked = checkForAnySelectedUnaccessibleField(this.props.aggsData,
      this.props.accessibleFieldObject, this.props.guppyConfig.accessibleValidationField);
    const lockMessage = `This chart is hidden because it contains fewer than ${this.props.tierAccessLimit} ${this.props.nodeCountTitle.toLowerCase()}`;
    const barChartColor = components.categorical2Colors ? components.categorical2Colors[0] : null;
    return (
      <div className={this.props.className}>
        <div className='guppy-explorer-visualization__button-group'>
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
            isLocked={isComponentLocked}
          />
        </div>
        {
          chartData.countItems.length > 0 && (
            <div className='guppy-explorer-visualization__summary-cards'>
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
          chartData.stackedBarCharts.map((chart, i) => (
            <PercentageStackedBarChart
              key={i}
              data={chart.data}
              title={chart.title}
              width='100%'
              lockMessage={lockMessage}
              useCustomizedColorMap={!!components.categorical9Colors}
              customizedColorMap={components.categorical9Colors || []}
            />
          ),
          )
        }
        {
          this.props.tableConfig.enabled && (
            <ExplorerTable
              className='guppy-explorer-visualization__table'
              tableConfig={{ fields: tableColumns }}
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
