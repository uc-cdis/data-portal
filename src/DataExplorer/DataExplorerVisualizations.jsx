import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { CurrentSQON } from '@arranger/components/dist/Arranger';
import DataExplorerTable from '../components/tables/DataExplorerTable';
import SummaryChartGroup from '../components/charts/SummaryChartGroup';
import SummaryHorizontalBarChart from '../components/charts/SummaryHorizontalBarChart';
import DataSummaryCardGroup from '../components/cards/DataSummaryCardGroup';
import { getSummaries } from '../components/charts/helper';
import { localTheme } from '../localconf';

class DataExplorerVisualizations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      summaries: [],
      showVisualization: true,
    };
  }

  toggleVisualization = () => {
    this.setState({ showVisualization: !this.state.showVisualization });
  }

  render() {
    const summaries = this.props.arrangerData ?
      getSummaries(this.props.arrangerData, this.props.arrangerConfig)
      : null;
    return (
      <div className="data-explorer__visualizations">
        <div
          className="data-explorer__visualizations-title"
          onClick={this.toggleVisualization}
          role="button"
          tabIndex={0}
        >
          <h4>Data Summary</h4>
          <FontAwesome
            className="data-explorer__visualizations-title-icon"
            name={this.state.showVisualization ? 'chevron-down' : 'chevron-up'}
          />
        </div>
        <CurrentSQON className="data-explorer__sqon" {...this.props} />
        { summaries && this.state.showVisualization ?
          <div className="data-explorer__charts">
            <DataSummaryCardGroup summaryItems={summaries.countItems} connected />
            <SummaryChartGroup summaries={summaries.charts} localTheme={localTheme} />
            {
              summaries.horizontalBarCharts.map((chart, i) =>
                (<SummaryHorizontalBarChart
                  key={i}
                  data={chart.data}
                  title={chart.title}
                  localTheme={localTheme}
                />),
              )
            }
          </div>
          : null}
        <DataExplorerTable {...this.props} />
      </div>
    );
  }
}

DataExplorerVisualizations.propTypes = {
  arrangerData: PropTypes.object,
  arrangerConfig: PropTypes.object,
};

DataExplorerVisualizations.defaultProps = {
  arrangerData: null,
  arrangerConfig: {},
};

export default DataExplorerVisualizations;
