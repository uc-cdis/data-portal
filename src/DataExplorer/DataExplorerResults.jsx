import React from 'react';
import PropTypes from 'prop-types';
import { CurrentSQON } from '@arranger/components/dist/Arranger';
import DataExplorerTable from '../components/tables/DataExplorerTable';
import SummaryChartGroup from '../components/charts/SummaryChartGroup';
import SummaryHorizontalBarChart from '../components/charts/SummaryHorizontalBarChart';
import DataSummaryCardGroup from '../components/cards/DataSummaryCardGroup';
import { localTheme } from '../localconf';

class DataExplorerResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      summaries: [],
      showVisualization: true,
    }
  }

  toggleVisualization = () => {
    this.setState({ showVisualization: !this.state.showVisualization });
  }

  transformArrangerDataToSummary = (field, chartType, title) => {
    return {
      type: chartType,
      title: title,
      data: this.transformArrangerDataToChart(field),
    }
  }

  transformArrangerDataToChart = (field) => {
    let chartData = [];
    field.buckets.map(bucket => {
      chartData.push({
        name: bucket.key,
        value: bucket.doc_count,
      })
    })
    return chartData;
  }

  transformDataToCount = (field, label) => {
    return {
      label: label,
      value: field.buckets.length,
    }
  }

  getSummaries = (data) => {
    let countItems = [];
    let charts = [];
    let horizontalBarCharts = [];

    if (data && data.subject.aggregations) {
      let fields = data.subject.aggregations;
      Object.keys(fields).map(field => {
        let fieldConfig = this.props.arrangerConfig.charts[field]
        if (fieldConfig) {
          switch(fieldConfig.chartType) {
            case 'count':
              return countItems.push(this.transformDataToCount(fields[field], fieldConfig.title));
            case 'pie':
            case 'bar':
              return charts.push(this.transformArrangerDataToSummary(fields[field], fieldConfig.chartType, fieldConfig.title));
            case 'horizontalBar':
              return horizontalBarCharts.push(this.transformArrangerDataToSummary(fields[field], fieldConfig.chartType, fieldConfig.title));
            default:
              return;
          }
        }
      })
    }
    return { charts: charts, countItems: countItems, horizontalBarCharts: horizontalBarCharts};
  }

  render() {
    const summaries = this.props.arrangerData ? this.getSummaries(this.props.arrangerData) : null;
    return (
      <div className="data-explorer__results">
        <h4 onClick={this.toggleVisualization}>Data Summary</h4>
        <CurrentSQON className="data-explorer__sqon" {...this.props} />
        { summaries && this.state.showVisualization ?
          <div className="data-explorer__visualizations">
            <DataSummaryCardGroup summaryItems={summaries.countItems} connected />
            <SummaryChartGroup summaries={summaries.charts} localTheme={localTheme} />
            {
              summaries.horizontalBarCharts.map((chart, i) =>
                <SummaryHorizontalBarChart key={i} data={chart.data} title={chart.title} localTheme={localTheme} />
              )
            }
          </div>
        : null}
        <DataExplorerTable {...this.props} />
      </div>
    )
  }
}

export default DataExplorerResults;
