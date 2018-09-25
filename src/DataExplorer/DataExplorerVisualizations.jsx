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
import { downloadManifest, downloadData } from './utils.js';
import { exportToCloud } from './custom/bdbag';

class DataExplorerVisualizations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showVisualization: true,
    };
  }

  onDownloadManifest = fileName => () => {
    if (this.props.selectedTableRows.length === 0) return;
    downloadManifest(this.props.api,
      this.props.projectId,
      this.props.selectedTableRows,
      this.props.arrangerConfig,
      fileName,
    );
  }

  onDownloadData = fileName => () => {
    if (this.props.selectedTableRows.length === 0) return;
    downloadData(
      this.props.api,
      this.props.projectId,
      this.props.selectedTableRows,
      this.props.arrangerConfig,
      fileName,
    );
  }

  onExportToCloud = () => {
    if (this.props.selectedTableRows.length === 0) return;
    exportToCloud(
      this.props.api,
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
    const tableToolbarActions = (
      <React.Fragment>
        {
          this.props.explorerTableConfig
          && this.props.explorerTableConfig.buttons
          && this.props.explorerTableConfig.buttons
            .filter(buttonConfig => buttonConfig.enabled)
            .map((buttonConfig) => {
              let clickFunc = () => {};
              if (buttonConfig.type === 'data') {
                clickFunc = this.onDownloadData(buttonConfig.fileName);
              }
              if (buttonConfig.type === 'manifest') {
                clickFunc = this.onDownloadManifest(buttonConfig.fileName);
              }
              if (buttonConfig.type === 'export') {
                clickFunc = this.onExportToCloud;
              }
              return (<Button
                key={buttonConfig.type}
                onClick={clickFunc}
                label={buttonConfig.title}
                leftIcon={buttonConfig.leftIcon}
                rightIcon={buttonConfig.rightIcon}
                className='data-explorer__download-button'
                buttonType='primary'
                enabled={selectedTableRowsCount > 0}
              />);
            },
            )
        }
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
  explorerTableConfig: PropTypes.object,
};

DataExplorerVisualizations.defaultProps = {
  arrangerData: null,
  arrangerConfig: {},
  sqon: null,
  selectedTableRows: [],
  projectId: 'search',
  api: () => {},
  explorerTableConfig: {},
};

export default DataExplorerVisualizations;
