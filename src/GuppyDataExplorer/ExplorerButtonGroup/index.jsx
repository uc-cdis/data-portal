import React from 'react';
import FileSaver from 'file-saver';
import Button from '@gen3/ui-component/dist/components/Button';
import Dropdown from '@gen3/ui-component/dist/components/Dropdown';
import Toaster from '@gen3/ui-component/dist/components/Toaster';
import { getGQLFilter } from '@gen3/guppy/dist/components/Utils/queries';
import PropTypes from 'prop-types';
import { calculateDropdownButtonConfigs, humanizeNumber } from '../../DataExplorer/utils';
import { ButtonConfigType, GuppyConfigType } from '../configTypeDef';
import { exportAllSelectedDataToCloud } from './bdbag';
import { fetchWithCreds } from '../../actions';
import { manifestServiceApiPath } from '../../localconf';
import './ExplorerButtonGroup.css';

class ExplorerButtonGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // for manifest
      manifestEntryCount: 0,

      // for exports
      toasterOpen: false,
      toasterHeadline: '',
      toasterError: null,
      toasterErrorText: 'There was an error exporting your cohort.',

      // for export to PFB
      exportPFBStatus: null,
      exportPFBURL: '',
      pfbStartText: 'Your PFB export is in progress. It may take up to 15 minutes to complete.',
      pfbWarning: 'Do not close your browser until your PFB export is finished.',
      pfbSuccessText: 'Your cohort has been exported to PFB! The URL is displayed below.',
      // for export to workspace
      exportingToWorkspace: false,
      exportWorkspaceFileName: null,
      exportWorkspaceStatus: null,
      workspaceSuccessText: 'Your cohort has been saved! In order to view and run analysis on this cohort, please go to the workspace.',

      // a semaphore that could hold pending state by multiple queries
      pendingManifestEntryCountRequestNumber: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.job && nextProps.job.status === 'Completed' && this.props.job.status !== 'Completed') {
      this.fetchJobResult()
        .then((res) => {
          this.setState({
            exportPFBURL: `${res.data.output}`.split('\n'),
            toasterOpen: true,
            toasterHeadline: this.state.pfbSuccessText });
        });
    }
    if (nextProps.totalCount !== this.props.totalCount
      && nextProps.totalCount) {
      this.refreshManifestEntryCount();
    }
  }

  componentWillUnmount() {
    this.props.resetJobState();
  }

  getOnClickFunction = (buttonConfig) => {
    let clickFunc = () => {};
    if (buttonConfig.type === 'data') {
      clickFunc = this.downloadData(buttonConfig.fileName);
    }
    if (buttonConfig.type === 'manifest') {
      clickFunc = this.downloadManifest(buttonConfig.fileName);
    }
    if (buttonConfig.type === 'export') {
      clickFunc = this.exportToCloud;
    }
    if (buttonConfig.type === 'export-to-pfb') {
      clickFunc = this.exportToPFB;
    }
    if (buttonConfig.type === 'export-to-workspace') {
      clickFunc = this.exportToWorkspace;
    }
    return clickFunc;
  };

  getManifest = async () => {
    const caseField = this.props.guppyConfig.manifestMapping.referenceIdFieldInDataIndex;
    const caseFieldInFileIndex =
      this.props.guppyConfig.manifestMapping.referenceIdFieldInResourceIndex;
    const fileFieldInFileIndex = this.props.guppyConfig.manifestMapping.resourceIdField;
    const fileType = this.props.guppyConfig.manifestMapping.resourceIndexType;
    const caseIDList = await this.props.downloadRawDataByFields({ fields: [caseField] })
      .then(res => res.map(i => i[caseField]));
    let resultManifest = await this.props.downloadRawDataByTypeAndFilter(
      fileType, {
        [caseFieldInFileIndex]: {
          selectedValues: caseIDList,
        },
      },
      [caseFieldInFileIndex, fileFieldInFileIndex],
    );
    resultManifest = resultManifest.filter(
      x => !!x[fileFieldInFileIndex]
    );
    /* eslint-disable no-param-reassign */
    resultManifest.forEach(function(x) {
      if(typeof x[caseFieldInFileIndex] === "string") {
        x[caseFieldInFileIndex] = [ x[caseFieldInFileIndex] ];  
      }
    });
    return resultManifest.flat();
  };

  getToaster = () => ((
    <Toaster isEnabled={this.state.toasterOpen} className={'explorer-button-group__toaster-div'}>
      <Button
        className='explorer-button-group__toaster-button'
        onClick={() => this.closeToaster()}
        label='Close'
        buttonType='primary'
        enabled
      />
      { (this.state.exportWorkspaceStatus === 200) ?
        <Button
          className='explorer-button-group__toaster-button'
          label='Go To Workspace'
          buttonType='primary'
          enabled
          onClick={this.gotoWorkspace}
        />
        : null
      }
      {
        <div className='explorer-button-group__toaster-text'>
          <div> {this.state.toasterHeadline} </div>
          { (this.state.exportWorkspaceFileName) ?
            <div> Most recent Workspace file name: { this.state.exportWorkspaceFileName } </div>
            : null
          }
          { (this.state.exportPFBURL) ?
            <div> Most recent PFB URL: { this.state.exportPFBURL } </div>
            : null
          }
          { (this.state.toasterError) ?
            <div> Error: { this.state.toasterError } </div>
            : null
          }
          { (this.isPFBRunning()) ?
            <div> { this.state.pfbWarning } </div>
            : null
          }
        </div>
      }
    </Toaster>
  ));

  fetchJobResult = async () => this.props.fetchJobResult(this.props.job.uid);

  isPFBRunning = () => this.props.job && this.props.job.status === 'Running';

  gotoWorkspace = () => this.props.history.push('/workspace');

  closeToaster = () => {
    this.setState({
      toasterOpen: false,
      toasterHeadline: '',
      toasterError: null,
    });
  };

  downloadData = filename => () => {
    this.props.downloadRawData().then((res) => {
      if (res) {
        const blob = new Blob([JSON.stringify(res, null, 2)], { type: 'text/json' });
        FileSaver.saveAs(blob, filename);
      } else {
        throw Error('Error when downloading data');
      }
    });
  };

  downloadManifest = filename => async () => {
    const resultManifest = await this.getManifest();
    if (resultManifest) {
      const blob = new Blob([JSON.stringify(resultManifest, null, 2)], { type: 'text/json' });
      FileSaver.saveAs(blob, filename);
    } else {
      throw Error('Error when downloading manifest');
    }
  };

  exportToCloud = () => {
    exportAllSelectedDataToCloud(this.props.downloadRawDataByFields);
  };

  exportToPFB = () => {
    this.props.submitJob({ filter: getGQLFilter(this.props.filter) });
    this.props.checkJobStatus();
    this.setState({
      toasterOpen: true,
      toasterHeadline: this.state.pfbStartText,
    });
  };

  exportToWorkspace = async () => {
    this.setState({ exportingToWorkspace: true });
    const resultManifest = await this.getManifest();
    if (!!resultManifest && resultManifest.length > 0) {
      fetchWithCreds({
        path: `${manifestServiceApiPath}`,
        body: JSON.stringify(resultManifest),
        method: 'POST',
      })
        .then(
          ({ status, data }) => {
            switch (status) {
            case 200:
              this.exportToWorkspaceSuccessHandler(data);
              return;
            default:
              this.exportToWorkspaceErrorHandler(status);
            }
          },
        );
    } else {
      this.exportToWorkspaceMessageHandler(400, "There were no data files found matching the cohort you created.");
    }
  };

  exportToWorkspaceSuccessHandler = (data) => {
    this.setState({
      toasterOpen: true,
      toasterHeadline: this.state.workspaceSuccessText,
      exportWorkspaceStatus: 200,
      exportingToWorkspace: false,
      exportWorkspaceFileName: data.filename,
    });
  };

  exportToWorkspaceErrorHandler = (status) => {
    this.setState({
      toasterOpen: true,
      toasterHeadline: this.state.toasterErrorText,
      exportWorkspaceStatus: status,
      exportingToWorkspace: false,
    });
  };

  exportToWorkspaceMessageHandler = (status, message) => {
    this.setState({
      toasterOpen: true,
      toasterHeadline: message,
      exportWorkspaceStatus: status,
      exportingToWorkspace: false,
    });
  };

  isFileButton = buttonConfig => buttonConfig.type === 'manifest' ||
    buttonConfig.type === 'export' ||
    buttonConfig.type === 'export-to-workspace' ||
    buttonConfig.type === 'export-to-pfb';

  refreshManifestEntryCount = async () => {
    if (this.props.isLocked) return;
    const caseField = this.props.guppyConfig.manifestMapping.referenceIdFieldInDataIndex;
    const caseFieldInFileIndex =
      this.props.guppyConfig.manifestMapping.referenceIdFieldInResourceIndex;
    this.setState(prevState => ({
      pendingManifestEntryCountRequestNumber: prevState.pendingManifestEntryCountRequestNumber + 1,
      manifestEntryCount: 0,
    }));
    if (this.props.buttonConfig
      && this.props.buttonConfig.buttons
      && this.props.buttonConfig.buttons.some(
        btnCfg => this.isFileButton(btnCfg) && btnCfg.enabled)) {
      const caseIDResult = await this.props.downloadRawDataByFields({ fields: [caseField] });
      if (caseIDResult) {
        const caseIDList = caseIDResult.map(i => i[caseField]);
        const fileType = this.props.guppyConfig.manifestMapping.resourceIndexType;
        const countResult = await this.props.getTotalCountsByTypeAndFilter(fileType, {
          [caseFieldInFileIndex]: {
            selectedValues: caseIDList,
          },
        });
        this.setState(prevState => ({
          manifestEntryCount: countResult,
          pendingManifestEntryCountRequestNumber:
            prevState.pendingManifestEntryCountRequestNumber - 1,
        }));
      } else {
        throw Error('Error when downloading data');
      }
    }
  };

  isButtonEnabled = (buttonConfig) => {
    if (this.props.isLocked) {
      return !this.props.isLocked;
    }
    if (buttonConfig.type === 'manifest') {
      return this.state.manifestEntryCount > 0;
    }
    if (buttonConfig.type === 'export-to-pfb') {
      return this.state.manifestEntryCount > 0;
    }
    if (buttonConfig.type === 'export-to-workspace') {
      return this.state.manifestEntryCount > 0;
    }

    return this.props.totalCount > 0;
  };

  isButtonPending = (buttonConfig) => {
    if (buttonConfig.type === 'export-to-workspace') {
      return this.state.exportingToWorkspace;
    }
    if (buttonConfig.type === 'export-to-pfb') {
      return this.isPFBRunning();
    }
    return false;
  };

  renderButton = (buttonConfig) => {
    const clickFunc = this.getOnClickFunction(buttonConfig);
    const pendingState = buttonConfig.type === 'manifest' ? (this.state.pendingManifestEntryCountRequestNumber > 0) : false;
    let buttonTitle = buttonConfig.title;
    if (buttonConfig.type === 'data') {
      const buttonCount = (this.props.totalCount >= 0) ? this.props.totalCount : 0;
      buttonTitle = `${buttonConfig.title} (${buttonCount})`;
    } else if (buttonConfig.type === 'manifest' && !pendingState && this.state.manifestEntryCount > 0) {
      buttonTitle = `${buttonConfig.title} (${humanizeNumber(this.state.manifestEntryCount)})`;
    }
    const btnTooltipText = (this.props.isLocked) ? 'You only have access to summary data' : buttonConfig.tooltipText;

    return (
      <Button
        key={buttonConfig.type}
        onClick={clickFunc}
        label={buttonTitle}
        leftIcon={buttonConfig.leftIcon}
        rightIcon={buttonConfig.rightIcon}
        className='explorer-button-group__download-button'
        buttonType='primary'
        enabled={this.isButtonEnabled(buttonConfig)}
        tooltipEnabled={buttonConfig.tooltipText ? !this.isButtonEnabled(buttonConfig) : false}
        tooltipText={btnTooltipText}
        isPending={this.isButtonPending(buttonConfig)}
      />
    );
  };

  render() {
    const dropdownConfigs = calculateDropdownButtonConfigs(this.props.buttonConfig);
    return (
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
                  className='explorer-button-group__dropdown'
                  disabled={this.props.totalCount === 0 || this.props.isLocked}
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
          this.props.buttonConfig
          && this.props.buttonConfig.buttons
          && this.props.buttonConfig.buttons
            .filter(buttonConfig => !dropdownConfigs
              || !buttonConfig.dropdownId
              || (dropdownConfigs[buttonConfig.dropdownId].cnt === 1),
            )
            .filter(buttonConfig => buttonConfig.enabled)
            .map(buttonConfig => this.renderButton(buttonConfig))
        }
        { this.getToaster() }
      </React.Fragment>
    );
  }
}

ExplorerButtonGroup.propTypes = {
  job: PropTypes.object,
  downloadRawData: PropTypes.func.isRequired, // from GuppyWrapper
  downloadRawDataByFields: PropTypes.func.isRequired, // from GuppyWrapper
  getTotalCountsByTypeAndFilter: PropTypes.func.isRequired, // from GuppyWrapper
  downloadRawDataByTypeAndFilter: PropTypes.func.isRequired, // from GuppyWrapper
  totalCount: PropTypes.number.isRequired, // from GuppyWrapper
  filter: PropTypes.object.isRequired, // from GuppyWrapper
  buttonConfig: ButtonConfigType.isRequired,
  guppyConfig: GuppyConfigType.isRequired,
  history: PropTypes.object.isRequired,
  submitJob: PropTypes.func.isRequired,
  resetJobState: PropTypes.func.isRequired,
  checkJobStatus: PropTypes.func.isRequired,
  fetchJobResult: PropTypes.func.isRequired,
  isLocked: PropTypes.bool.isRequired,
};

ExplorerButtonGroup.defaultProps = {
  job: null,
};

export default ExplorerButtonGroup;
