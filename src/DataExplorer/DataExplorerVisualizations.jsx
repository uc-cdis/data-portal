import React from 'react';
import PropTypes from 'prop-types';
import { CurrentSQON } from '@arranger/components/dist/Arranger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataExplorerTable from '../components/tables/DataExplorerTable';
import SummaryChartGroup from '../components/charts/SummaryChartGroup';
import PercentageStackedBarChart from '../components/charts/PercentageStackedBarChart';
import DataSummaryCardGroup from '../components/cards/DataSummaryCardGroup';
import { getCharts } from '../components/charts/helper';
import { localTheme } from '../localconf';

class DataExplorerVisualizations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showVisualization: true,
    };
  }

  toggleVisualization = () => {
    this.setState({ showVisualization: !this.state.showVisualization });
  }

  render() {
    const charts = this.props.arrangerData ?
      getCharts(this.props.arrangerData, this.props.arrangerConfig)
      : null;
    return (
      <div className='data-explorer__visualizations'>
        <CurrentSQON className='data-explorer__sqon' {...this.props} />
        <div
          className='data-explorer__visualizations-title'
          onClick={this.toggleVisualization}
          role='button'
          onKeyDown={this.toggleVisualization}
          tabIndex={0}
        >
          <h4>Data Summary</h4>
          <FontAwesomeIcon
            className='data-explorer__visualizations-title-icon'
            icon={this.state.showVisualization ? 'angle-down' : 'angle-up'}
            size='lg'
          />
        </div>
        { charts && this.state.showVisualization ?
          <div className='data-explorer__charts'>
            <DataSummaryCardGroup summaryItems={charts.countItems} connected />
            <SummaryChartGroup summaries={charts.summaries} localTheme={localTheme} />
            {
              charts.stackedBarCharts.map((chart, i) =>
                (<PercentageStackedBarChart
                  key={i}
                  data={chart.data}
                  title={chart.title}
                  localTheme={localTheme}
                  width='100%'
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
