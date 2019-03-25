import React from 'react';
import PropTypes from 'prop-types';
import { CurrentSQON } from '@arranger/components/dist/Arranger';
import Button from '@gen3/ui-component/dist/components/Button';
import Dropdown from '@gen3/ui-component/dist/components/Dropdown';
import Spinner from '../components/Spinner';
import DataExplorerTable from '../components/tables/DataExplorerTable';
import SummaryChartGroup from '../components/charts/SummaryChartGroup/.';
import PercentageStackedBarChart from '../components/charts/PercentageStackedBarChart/.';
import DataSummaryCardGroup from '../components/cards/DataSummaryCardGroup/.';
import { getCharts } from '../components/charts/helper';
import { downloadManifest, downloadData, getManifestEntryCount } from './actionHelper';
import { calculateDropdownButtonConfigs, humanizeNumber } from './utils';
import { exportAllSelectedDataToCloud } from './custom/bdbag';

class DataExplorerVisualizations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      manifestEntryCount: 0,
      nodeIds: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.arrangerData !== this.props.arrangerData) {
      const arrangerConfig = nextProps.dataExplorerConfig.arrangerConfig;
      const data = nextProps.arrangerData &&
        nextProps.arrangerData[arrangerConfig.graphqlField];
      const aggregations = data && data.aggregations ? data.aggregations : null;
      const nodeIds = aggregations[arrangerConfig.nodeCountField].buckets.map(bucket => bucket.key);
      this.setState({ nodeIds }, () => {
        this.refreshManifestEntryCount(this.state.nodeIds);
      });
    }
  }

  onDownloadManifest = fileName => () => {
    downloadManifest(
      this.props.api,
      this.props.projectId,
      this.props.dataExplorerConfig.arrangerConfig.nodeCountField,
      this.state.nodeIds,
      this.props.dataExplorerConfig.arrangerConfig,
      fileName,
    );
  }

  onDownloadData = fileName => () => {
    downloadData(
      this.props.api,
      this.props.projectId,
      this.props.dataExplorerConfig.arrangerConfig.nodeCountField,
      this.state.nodeIds,
      this.props.dataExplorerConfig.arrangerConfig,
      fileName,
    );
  }

  onExportToCloud = () => {
    exportAllSelectedDataToCloud(
      this.props.api,
      this.props.projectId,
      this.props.dataExplorerConfig.arrangerConfig.nodeCountField,
      this.state.nodeIds,
      this.props.dataExplorerConfig.arrangerConfig,
    );
  }

  getOnClickFunction = (buttonConfig) => {
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
    return clickFunc;
  }

  isFileButton = buttonConfig => buttonConfig.type === 'manifest' ||
      buttonConfig.type === 'export' ||
      buttonConfig.type === 'export-to-workspace';

  refreshManifestEntryCount = () => {
    if (this.props.dataExplorerConfig
      && this.props.dataExplorerConfig.buttons
      && this.props.dataExplorerConfig.buttons.some(
        btnCfg => this.isFileButton(btnCfg) && btnCfg.enabled)
    ) {
      getManifestEntryCount(
        this.props.api,
        this.props.projectId,
        this.props.dataExplorerConfig.arrangerConfig.nodeCountField,
        this.state.nodeIds,
        this.props.dataExplorerConfig.arrangerConfig,
      ).then((r) => {
        this.setState({ manifestEntryCount: r });
      });
    }
  }

  isButtonEnabled = (buttonConfig) => {
    if (buttonConfig.type === 'manifest') {
      return this.state.nodeIds.length > 0 && this.state.manifestEntryCount > 0;
    }

    return this.state.nodeIds.length > 0;
  }

  renderButton = (buttonConfig) => {
    const clickFunc = this.getOnClickFunction(buttonConfig);
    let buttonTitle = buttonConfig.title;
    if (this.isFileButton(buttonConfig) && this.state.nodeIds.length > 0) {
      buttonTitle = `${buttonConfig.title} (${humanizeNumber(this.state.manifestEntryCount)})`;
    } else if (buttonConfig.type === 'data') {
      buttonTitle = `${buttonConfig.title} (${humanizeNumber(this.state.nodeIds.length)})`;
    }

    return (<Button
      key={buttonConfig.type}
      onClick={clickFunc}
      label={buttonTitle}
      leftIcon={buttonConfig.leftIcon}
      rightIcon={buttonConfig.rightIcon}
      className='data-explorer__download-button'
      buttonType='primary'
      enabled={this.isButtonEnabled(buttonConfig)}
      tooltipEnabled={buttonConfig.tooltipText ? !this.isButtonEnabled(buttonConfig) : false}
      tooltipText={buttonConfig.tooltipText}
    />);
  }

  render() {
    const charts = this.props.arrangerData ?
      getCharts(this.props.arrangerData, this.props.dataExplorerConfig, this.props.sqon)
      : null;
    if (this.props.dataExplorerConfig.charts.fileCounts && charts) {
      charts.countItems.push({ label: 'Files', value: this.state.manifestEntryCount });
    }
    const dropdownConfigs = calculateDropdownButtonConfigs(this.props.dataExplorerConfig);

    return (
      <div className='data-explorer__visualizations'>
        <div className='data-explorer__button-section'>
          {
          /*
          * First, render dropdown buttons
          * Buttons are grouped under same dropdown if they have the same dropdownID
          * If only one button points to the same dropdownId, it won't be grouped into dropdown
          *   but will only be rendered as sinlge normal button instead.
          */
            dropdownConfigs && Object.keys(dropdownConfigs).length > 0
          && Object.keys(dropdownConfigs)
            .filter(dropdownId => (dropdownConfigs[dropdownId].cnt > 1))
            .map((dropdownId) => {
              const entry = dropdownConfigs[dropdownId];
              const btnConfigs = entry.buttonConfigs;
              const dropdownTitle = entry.dropdownConfig.title;
              return (
                <Dropdown
                  key={dropdownId}
                  className='data-explorer__dropdown'
                  disabled={this.state.nodeIds.length === 0}
                >
                  <Dropdown.Button>{dropdownTitle}</Dropdown.Button>
                  <Dropdown.Menu>
                    {
                      btnConfigs.map((btnCfg) => {
                        const onClick = this.getOnClickFunction(btnCfg);
                        return (
                          <Dropdown.Item
                            key={btnCfg.type}
                            leftIcon='datafile'
                            rightIcon='download'
                            onClick={onClick}
                          >
                            {btnCfg.title}
                          </Dropdown.Item>
                        );
                      })
                    }
                  </Dropdown.Menu>
                </Dropdown>
              );
            })
          }
          {
          /**
          * Second, render normal buttons.
          * Buttons without dropdownId are rendered as normal buttons
          * Buttons don't share same dropdownId with others are rendered as normal buttons
          */
            this.props.dataExplorerConfig
          && this.props.dataExplorerConfig.buttons
          && this.props.dataExplorerConfig.buttons
            .filter(buttonConfig =>
              !dropdownConfigs
              || !buttonConfig.dropdownId
              || (dropdownConfigs[buttonConfig.dropdownId].cnt === 1),
            )
            .filter(buttonConfig => buttonConfig.enabled)
            .map(buttonConfig =>
              this.renderButton(buttonConfig))
          }
        </div>
        <CurrentSQON className='data-explorer__sqon' {...this.props} />
        { charts ?
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
          : <Spinner />
        }
        {
          this.props.dataExplorerConfig.table && this.props.dataExplorerConfig.table.enabled ? (
            <DataExplorerTable {...this.props} />
          ) : null
        }
      </div>
    );
  }
}

DataExplorerVisualizations.propTypes = {
  arrangerData: PropTypes.object,
  dataExplorerConfig: PropTypes.object,
  sqon: PropTypes.object,
  projectId: PropTypes.string,
  api: PropTypes.func,
};

DataExplorerVisualizations.defaultProps = {
  arrangerData: null,
  dataExplorerConfig: {
    arrangerConfig: {},
  },
  sqon: null,
  projectId: 'search',
  api: () => {},
};

export default DataExplorerVisualizations;
