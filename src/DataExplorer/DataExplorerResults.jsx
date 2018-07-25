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
        switch(field) {
          case 'project':
            return countItems.push(this.transformDataToCount(fields[field], field))
          case 'study':
            return countItems.push(this.transformDataToCount(fields[field], field))
          case 'ethnicity':
            return horizontalBarCharts.push(this.transformArrangerDataToSummary(fields[field], 'bar', field))
          case 'file_type':
            return countItems.push(this.transformDataToCount(fields[field], field))
          case 'gender':
            return charts.push(this.transformArrangerDataToSummary(fields[field], 'bar', field))
          case 'race':
            return charts.push(this.transformArrangerDataToSummary(fields[field], 'pie', field))
          case 'vital_status':
            return charts.push(this.transformArrangerDataToSummary(fields[field], 'bar', field))
          default:
            return
          }
      })
      return { charts: charts, countItems: countItems, horizontalBarCharts: horizontalBarCharts};
    }
  }

  render() {
    const data = this.props.arrangerData;
    return (
      <div className="data-explorer__results">
        <h4 onClick={this.toggleVisualization}>Data Summary</h4>
        <CurrentSQON className="data-explorer__sqon" {...this.props} />
        { data && this.state.showVisualization ?
          <div className="data-explorer__visualizations">
            <DataSummaryCardGroup summaryItems={this.getSummaries(data).countItems} connected />
            <SummaryChartGroup summaries={this.getSummaries(data).charts} localTheme={localTheme} />
            {
              this.getSummaries(data).horizontalBarCharts.map((chart, i) =>
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
