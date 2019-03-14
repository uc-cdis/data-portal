import React from 'react';
import PropTypes from 'prop-types';
import SummaryChartGroup from '../../components/charts/SummaryChartGroup/.';
import ExplorerTable from '../ExplorerTable';
import PercentageStackedBarChart from '../../components/charts/PercentageStackedBarChart/.';
import DataSummaryCardGroup from '../../components/cards/DataSummaryCardGroup/.';

class ExplorerVisualization extends React.Component {
  getData = (aggsData, chartConfig, filter) => {
    const summaries = [];
    const countItems = [];
    const stackedBarCharts = [];
    Object.keys(chartConfig).forEach(field => {
      if (!aggsData || !aggsData[field] || !aggsData[field].histogram) return;
      const histogram = aggsData[field].histogram;
      switch (chartConfig[field].chartType) {
        case 'count': 
          countItems.push({
            label: chartConfig[field].title,
            value: filter[field] ? filter[field].selectedValues.length : aggsData[field].histogram.length,
          });
        break;
        case 'pie':
        case 'bar': 
        case 'stackedBar':
          const dataItem = {
            type: chartConfig[field].chartType,
            title: chartConfig[field].title,
            data: histogram.map(i => ({name: i.key, value: i.count})),
          };
          if ('stackedBar' === chartConfig[field].chartType) {
            stackedBarCharts.push(dataItem);
          }
          else {
            summaries.push(dataItem);
          }
        break;
        default: 
          throw new Error(`Invalid chartType ${chartConfig[field].chartType}`);
      }
    });
    return { summaries, countItems, stackedBarCharts };
  }

  render() {
    const chartData = this.getData(this.props.aggsData, this.props.chartConfig, this.props.filter);
    return (
      <div className={`${this.props.className} explorer-visualization`}>
        <DataSummaryCardGroup summaryItems={chartData.countItems} connected />
        <SummaryChartGroup summaries={chartData.summaries} />
        {
          chartData.stackedBarCharts.map((chart, i) =>
            (<PercentageStackedBarChart
              key={i}
              data={chart.data}
              title={chart.title}
              width='100%'
            />),
          )
        }
        <ExplorerTable className='guppy-data-explorer__table'/>
      </div>
    );
  }
}

ExplorerVisualization.propTypes = {
  className: PropTypes.string,
  aggsData: PropTypes.object,
  filter: PropTypes.object,
  chartConfig: PropTypes.object,
};

ExplorerVisualization.defaultProps = {
  className: '',
  aggsData: {},
  filter: {},
  chartConfig: {},
};

export default ExplorerVisualization;