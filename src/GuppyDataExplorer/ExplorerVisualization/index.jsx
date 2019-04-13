import React from 'react';
import PropTypes from 'prop-types';
import SummaryChartGroup from '@gen3/ui-component/dist/components/charts/SummaryChartGroup';
import PercentageStackedBarChart from '@gen3/ui-component/dist/components/charts/PercentageStackedBarChart';
import DataSummaryCardGroup from '../../components/cards/DataSummaryCardGroup';
import ExplorerTable from '../ExplorerTable';
import ExplorerButtonGroup from '../ExplorerButtonGroup';
import {
  TableConfigType,
  ButtonConfigType,
  ChartConfigType,
  GuppyConfigType,
} from '../configTypeDef';
import './ExplorerVisualization.css';

class ExplorerVisualization extends React.Component {
  getData = (aggsData, chartConfig, filter) => {
    const summaries = [];
    const countItems = [];
    const stackedBarCharts = [];
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
    return (
      <div className={this.props.className}>
        <div className='guppy-explorer-visualization__button-group'>
          <ExplorerButtonGroup
            buttonConfig={this.props.buttonConfig}
            guppyConfig={this.props.guppyConfig}
            totalCount={this.props.totalCount}
            downloadRawData={this.props.downloadRawData}
            downloadRawDataByFields={this.props.downloadRawDataByFields}
            getTotalCountsByTypeAndFilter={this.props.getTotalCountsByTypeAndFilter}
            downloadRawDataByTypeAndFilter={this.props.downloadRawDataByTypeAndFilter}
            filter={this.props.filter}
          />
        </div>
        <div className='guppy-explorer-visualization__summary-cards'>
          <DataSummaryCardGroup summaryItems={chartData.countItems} connected />
        </div>
        <div className='guppy-explorer-visualization__charts'>
          <SummaryChartGroup summaries={chartData.summaries} />
        </div>
        {
          chartData.stackedBarCharts.map((chart, i) => (
            <PercentageStackedBarChart
              key={i}
              data={chart.data}
              title={chart.title}
              width='100%'
            />
          ),
          )
        }
        <ExplorerTable
          className='guppy-explorer-visualization__table'
          tableConfig={this.props.tableConfig}
          fetchAndUpdateRawData={this.props.fetchAndUpdateRawData}
          rawData={this.props.rawData}
          totalCount={this.props.totalCount}
          guppyConfig={this.props.guppyConfig}
        />
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
  className: PropTypes.string,
  chartConfig: ChartConfigType,
  tableConfig: TableConfigType,
  buttonConfig: ButtonConfigType,
  guppyConfig: GuppyConfigType,
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
  className: '',
  chartConfig: {},
  tableConfig: {},
  buttonConfig: {},
  guppyConfig: {},
};

export default ExplorerVisualization;
