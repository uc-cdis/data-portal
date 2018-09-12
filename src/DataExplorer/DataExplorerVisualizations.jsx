import React from 'react';
import PropTypes from 'prop-types';
import { CurrentSQON } from '@arranger/components/dist/Arranger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@gen3/ui-component/dist/components/Button';
import DataExplorerTable from '../components/tables/DataExplorerTable';
import SummaryChartGroup from '../components/charts/SummaryChartGroup/.';
import PercentageStackedBarChart from '../components/charts/PercentageStackedBarChart/.';
import DataSummaryCardGroup from '../components/cards/DataSummaryCardGroup/.';
import { getCharts } from '../components/charts/helper';
import { downloadManifest } from './utils.js';

class DataExplorerVisualizations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showVisualization: true,
    };
  }

  onDownloadManifest = () => {
    if (this.props.selectedTableRows.length === 0) return;
    downloadManifest(this.props.api,
      this.props.projectId,
      this.props.selectedTableRows,
      this.props.arrangerConfig,
    );
  }

  toggleVisualization = () => {
    this.setState({ showVisualization: !this.state.showVisualization });
  }

  render() {
    const charts = this.props.arrangerData ?
      getCharts(this.props.arrangerData, this.props.arrangerConfig, this.props.sqon)
      : null;
    const selectedTableRowsCount = this.props.selectedTableRows.length;

    const DOWNLOAD_MANIFEST_BUTTON_TEXT = 'Download Manifest';
    const tableToolbarActions = (
      <React.Fragment>
        <Button
          onClick={this.onDownloadManifest}
          label={DOWNLOAD_MANIFEST_BUTTON_TEXT}
          rightIcon='download'
          leftIcon='datafile'
          className='data-explorer__manifest-button'
          buttonType='primary'
          enabled={selectedTableRowsCount > 0}
        />
      </React.Fragment>
    );
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
            <SummaryChartGroup summaries={charts.summaries} />
            {
              charts.stackedBarCharts.map((chart, i) =>
                (<PercentageStackedBarChart
                  key={i}
                  data={chart.data}
                  title={chart.title}
                  width='100%'
                />),
              )
            }
          </div>
          : null}
        <DataExplorerTable {...this.props} customActions={tableToolbarActions} />
      </div>
    );
  }
}

DataExplorerVisualizations.propTypes = {
  arrangerData: PropTypes.object,
  arrangerConfig: PropTypes.object,
  sqon: PropTypes.object,
  selectedTableRows: PropTypes.array,
  projectId: PropTypes.string,
  api: PropTypes.func,
};

DataExplorerVisualizations.defaultProps = {
  arrangerData: null,
  arrangerConfig: {},
  sqon: null,
  selectedTableRows: [],
  projectId: 'search',
  api: () => {},
};

export default DataExplorerVisualizations;
