import React from 'react';
import PropTypes from 'prop-types';
import { CurrentSQON } from '@arranger/components/dist/Arranger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@gen3/ui-component/dist/components/Button';
import Dropdown from '@gen3/ui-component/dist/components/Dropdown';
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
      showVisualization: true,
      manifestEntryCount: 0,
      idField: null,
      nodeIds: [],
    };
  }

  componentWillUpdate(nextProps) {
    if (nextProps.arrangerData !== this.props.arrangerData) {
      const data = nextProps.arrangerData && nextProps.arrangerData[nextProps.arrangerConfig.graphqlField];
      const aggregations = data && data.aggregations ? data.aggregations : null;
      let idField = null;
      if (aggregations && aggregations.node_id) {
        idField = 'node_id';
      } else if (aggregations && aggregations.submitter_id) {
        idField = 'submitter_id';
      }
      const nodeIds = idField ? aggregations[idField].buckets.map(bucket => bucket.key) : [];
      this.setState({ idField, nodeIds });
    }
  }

  onDownloadManifest = fileName => () => {
    downloadManifest(
      this.props.api,
      this.props.projectId,
      this.state.idField,
      this.state.nodeIds,
      this.props.arrangerConfig,
      fileName,
    );
  }

  onDownloadData = fileName => () => {
    downloadData(
      this.props.api,
      this.props.projectId,
      this.state.idField,
      this.state.nodeIds,
      this.props.arrangerConfig,
      fileName,
    );
  }

  onExportToCloud = () => {
    exportAllSelectedDataToCloud(
      this.props.api,
      this.props.projectId,
      this.state.idField,
      this.state.nodeIds,
      this.props.arrangerConfig,
    );
  }

  onSelectedRowsChange = () => {
    this.refreshManifestEntryCount(this.state.nodeIds);
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

  refreshManifestEntryCount = () => {
    if (this.props.explorerTableConfig
      && this.props.explorerTableConfig.buttons
      && this.props.explorerTableConfig.buttons.some(btnCfg => btnCfg.type === 'manifest' && btnCfg.enabled)) {
      getManifestEntryCount(
        this.props.api,
        this.props.projectId,
        this.state.idField,
        this.state.nodeIds,
        this.props.arrangerConfig,
      ).then((r) => {
        this.setState({ manifestEntryCount: r });
      });
    }
  }

  toggleVisualization = () => {
    this.setState({ showVisualization: !this.state.showVisualization });
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
    if (buttonConfig.type === 'manifest' && this.state.nodeIds.length > 0) {
      buttonTitle = `${buttonConfig.title} (${humanizeNumber(this.state.manifestEntryCount)})`;
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
    console.log(this.props.arrangerData)
    const charts = this.props.arrangerData ?
      getCharts(this.props.arrangerData, this.props.arrangerConfig, this.props.sqon)
      : null;
    const dropdownConfigs = calculateDropdownButtonConfigs(this.props.explorerTableConfig);
    const tableToolbarActions = (
      <React.Fragment>
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
          this.props.explorerTableConfig
          && this.props.explorerTableConfig.buttons
          && this.props.explorerTableConfig.buttons
            .filter(buttonConfig =>
              !dropdownConfigs
              || !buttonConfig.dropdownId
              || (dropdownConfigs[buttonConfig.dropdownId].cnt === 1),
            )
            .filter(buttonConfig => buttonConfig.enabled)
            .map(buttonConfig =>
              this.renderButton(buttonConfig))
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
        <DataExplorerTable
          customActions={tableToolbarActions}
          onSelectedRowsChange={this.onSelectedRowsChange}
          {...this.props}
        />
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
