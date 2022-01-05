import React from 'react';
import FileSaver from 'file-saver';
import _ from 'lodash';
import Button from '@gen3/ui-component/dist/components/Button';
import Dropdown from '@gen3/ui-component/dist/components/Dropdown';
import Toaster from '@gen3/ui-component/dist/components/Toaster';
import { getGQLFilter } from '@gen3/guppy/dist/components/Utils/queries';
import PropTypes from 'prop-types';
import { calculateDropdownButtonConfigs, humanizeNumber } from '../utils';
import { ButtonConfigType, GuppyConfigType } from '../configTypeDef';
import { fetchWithCreds } from '../../actions';
import { manifestServiceApiPath, guppyGraphQLUrl, terraExportWarning } from '../../localconf';
import './ExplorerButtonGroup.css';
import Popup from '../../components/Popup';

// template variable for export-pfb-to-url button config.
// see docs/export_pfb_to_url.md
const PRESIGNED_URL_TEMPLATE_VARIABLE = '{{PRESIGNED_URL}}';
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
      downloadingInProgress: {
        data: false,
        manifest: false,
        fileManifest: false,
      },
      downloadingInProgressToasterText: 'Your download has started and it may take up to several minutes. Please do not navigate away from this page.',
      exportingToTerra: false,
      exportingToSevenBridges: false,
      exportingPFBToURL: false,
      targetURLTemplate: '', // stores the target URL when the user clicks an 'export-pfb-to-url' button
      // for export to PFB
      exportPFBURL: '',
      exportPFBToWorkspaceGUID: '',
      pfbStartText: 'Your export is in progress.',
      pfbWarning: 'Please do not navigate away from this page until your export is finished.',
      pfbSuccessText: 'Your cohort has been exported to PFB.',
      pfbToWorkspaceSuccessText: 'A PFB for this cohort will be saved to your workspace. The GUID for your PFB is displayed below.',
      exportPFBToWorkspaceStatus: null,
      // for export to PFB in Files tab
      sourceNodesInCohort: [],
      // for export to workspace
      exportingToWorkspace: false,
      exportWorkspaceFileName: null,
      exportWorkspaceStatus: null,
      workspaceSuccessText: 'Your cohort has been saved! In order to view and run analysis on this cohort, please go to the workspace.',
    };

    // Display misconfiguration warnings if Export PFB to Terra/SBG buttons are present
    // but no URL was configured to send the PFBs to.
    const exportToTerraButtonPresent = props.buttonConfig && props.buttonConfig.buttons
      && props.buttonConfig.buttons.some((btn) => btn.type === 'export' || btn.type === 'export-files');
    if (exportToTerraButtonPresent && !this.props.buttonConfig.terraExportURL) {
      console.error('Misconfiguration error: Export to Terra button is present, but there is no `terraExportURL` specified in the portal config.'); // eslint-disable-line no-console
    }
    const exportToSevenBridgesButtonPresent = props.buttonConfig && props.buttonConfig.buttons
      && props.buttonConfig.buttons.some((btn) => btn.type === 'export-to-seven-bridges' || btn.type === 'export-files-to-seven-bridges');
    if (exportToSevenBridgesButtonPresent && !this.props.buttonConfig.sevenBridgesExportURL) {
      console.error('Misconfiguration error: Export to Seven Bridges button is present, but there is no `sevenBridgesExportURL` specified in the portal config.'); // eslint-disable-line no-console
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.job && this.props.job.status === 'Failed' && prevProps.job && prevProps.job.status !== 'Failed') {
      this.onJobFailed(prevState.toasterErrorText);
    }
    if (this.props.job && this.props.job.status === 'Completed' && prevProps.job && prevProps.job.status !== 'Completed') {
      this.fetchJobResult()
        .then((res) => {
          if (this.state.exportingToTerra) {
            this.setState({
              exportPFBURL: `${res.data.output}`.split('\n'),
              toasterOpen: false,
              exportingToTerra: false,
            }, () => {
              this.sendPFBToTerra();
            });
          } else if (this.state.exportingToSevenBridges) {
            this.setState({
              exportPFBURL: `${res.data.output}`.split('\n'),
              toasterOpen: false,
              exportingToSevenBridges: false,
            }, () => {
              this.sendPFBToSevenBridges();
            });
          } else if (this.state.exportingPFBToURL) {
            this.setState({
              exportPFBURL: `${res.data.output}`.split('\n'),
              toasterOpen: false,
              exportingPFBToURL: false,
            }, () => {
              this.sendPFBToURL(this.state.targetURLTemplate, this.state.exportPFBURL);
            });
          } else if (this.state.exportingPFBToWorkspace) {
            const pfbGUID = `${res.data.output}`.split('\n')[0];
            this.sendPFBToWorkspace(pfbGUID);
          } else {
            this.setState({
              exportPFBURL: `${res.data.output}`.split('\n'),
              toasterOpen: true,
              toasterHeadline: prevState.pfbSuccessText,
            });
          }
        });
    }
    if (prevProps.totalCount !== this.props.totalCount
      && this.props.totalCount) {
      this.refreshManifestEntryCount();
    }
    if (prevProps.buttonConfig.enableLimitedFilePFBExport
      && prevProps.filter !== this.props.filter) {
      const { sourceNodeField } = prevProps.buttonConfig.enableLimitedFilePFBExport;
      if (!sourceNodeField) {
        throw new Error('Limited File PFB Export is enabled, but \'sourceNodeField\' has not been specified. Check the portal config.');
      }
      this.refreshSourceNodes(this.props.filter, sourceNodeField);
    }
  }

  componentWillUnmount() {
    this.props.resetJobState();
  }

  onJobFailed = (toasterHeadline) => {
    this.setState({
      toasterOpen: true,
      toasterHeadline,
    });
  }

  getOnClickFunction = (buttonConfig) => {
    let clickFunc = () => {};

    if (buttonConfig.type.startsWith('data')) {
      clickFunc = this.downloadData(buttonConfig.fileName, buttonConfig.type.split('-').pop());
    }
    if (buttonConfig.type === 'manifest') {
      clickFunc = this.downloadManifest(buttonConfig.fileName, null);
    }
    if (buttonConfig.type === 'file-manifest') {
      clickFunc = this.downloadManifest(buttonConfig.fileName, 'file');
    }
    if (buttonConfig.type === 'export-pfb-to-url') {
      if (!buttonConfig.targetURLTemplate) {
        throw new Error('Misconfiguration Error! Expected button of type `export-pfb-to-url` to have the required `targetURLTemplate` property');
      } else if (buttonConfig.targetURLTemplate.indexOf(PRESIGNED_URL_TEMPLATE_VARIABLE) === -1) {
        throw new Error(`Misconfiguration error! An \`export-pfb-to-url\` button has a bad \`targetURLTemplate\` property. The string \`${PRESIGNED_URL_TEMPLATE_VARIABLE}\` must appear in the \`targetURLTemplate\` property. Bad \`targetURLTemplate\`: ${this.state.targetURLTemplate}`);
      }
      clickFunc = this.exportPFBToURL(buttonConfig.targetURLTemplate);
    }
    if (buttonConfig.type === 'export') {
      // REMOVE THIS CODE WHEN TERRA EXPORT WORKS
      // =======================================
      if (terraExportWarning) {
        clickFunc = this.exportToTerraWithWarning;
      } else {
      // =======================================
        clickFunc = this.exportToTerra;
      }
    }
    if (buttonConfig.type === 'export-files') {
      // REMOVE THIS CODE WHEN TERRA EXPORT WORKS
      // =======================================
      if (terraExportWarning) {
        clickFunc = this.exportFilesToTerraWithWarning;
      } else {
      // =======================================
        clickFunc = this.exportFilesToTerra;
      }
    }
    if (buttonConfig.type === 'export-to-seven-bridges') {
      clickFunc = this.exportToSevenBridges;
    }
    if (buttonConfig.type === 'export-files-to-seven-bridges') {
      clickFunc = this.exportFilesToSevenBridges;
    }
    if (buttonConfig.type === 'export-to-pfb') {
      clickFunc = this.exportToPFB;
    }
    if (buttonConfig.type === 'export-files-to-pfb') {
      clickFunc = this.exportFilesToPFB;
    }
    if (buttonConfig.type === 'export-to-workspace') {
      clickFunc = this.exportToWorkspace;
    }
    if (buttonConfig.type === 'export-files-to-workspace') {
      clickFunc = () => this.exportToWorkspace('file');
    }
    if (buttonConfig.type === 'export-pfb-to-workspace') {
      clickFunc = this.exportPFBToWorkspace;
    }
    return clickFunc;
  };

  getManifest = async (indexType) => {
    if (!this.props.guppyConfig.manifestMapping
      || !this.props.guppyConfig.manifestMapping.referenceIdFieldInDataIndex) {
      return Promise.reject('No "guppyConfig.manifestMapping" or "guppyConfig.manifestMapping.referenceIdFieldInDataIndex" defined in config');
    }
    const refField = this.props.guppyConfig.manifestMapping.referenceIdFieldInDataIndex;
    const md5Field = 'md5sum';
    const fileNameField = 'file_name';
    const fileSizeField = 'file_size';
    const additionalFields = [md5Field, fileNameField, fileSizeField];
    if (indexType === 'file') {
      let rawData;
      try {
        // the additionalFields are hardcoded, so it's possible they may
        // not be available in Guppy's index. Try to download the additional fields
        // first, and if the download fails, download only the referenceIDField.
        rawData = await this.props.downloadRawDataByFields({
          fields: [
            refField,
            ...additionalFields,
          ],
        });
      } catch (err) {
        rawData = await this.props.downloadRawDataByFields({
          fields: [
            refField,
          ],
        });
      }
      return rawData;
    }
    let refIDList = await this.props.downloadRawDataByFields({ fields: [refField] })
      .then((res) => res.map((i) => i[refField]));
    refIDList = _.uniq(refIDList);
    const refFieldInResourceIndex = this.props.guppyConfig.manifestMapping.referenceIdFieldInResourceIndex;
    const resourceFieldInResourceIndex = this.props.guppyConfig.manifestMapping.resourceIdField;
    const resourceType = this.props.guppyConfig.manifestMapping.resourceIndexType;
    const filter = {
      [refFieldInResourceIndex]: {
        selectedValues: refIDList,
      },
    };
    if (this.props.filter.data_format) {
      filter.data_format = this.props.filter.data_format;
    }
    let resultManifest;
    try {
      resultManifest = await this.props.downloadRawDataByTypeAndFilter(
        resourceType,
        filter,
        [
          refFieldInResourceIndex,
          resourceFieldInResourceIndex,
          ...additionalFields,
        ],
      );
    } catch (err) {
      resultManifest = await this.props.downloadRawDataByTypeAndFilter(
        resourceType,
        filter,
        [
          refFieldInResourceIndex,
          resourceFieldInResourceIndex,
        ],
      );
    }
    resultManifest = resultManifest.filter(
      (x) => !!x[resourceFieldInResourceIndex],
    );
    /* eslint-disable no-param-reassign */
    resultManifest.forEach((x) => {
      if (typeof x[refFieldInResourceIndex] === 'string') {
        x[refFieldInResourceIndex] = [x[refFieldInResourceIndex]];
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
      { (this.state.exportWorkspaceStatus === 200
        || this.state.exportPFBToWorkspaceStatus === 200)
        ? (
          <Button
            className='explorer-button-group__toaster-button'
            label='Go To Workspace'
            buttonType='primary'
            enabled
            onClick={this.gotoWorkspace}
          />
        )
        : null}
      {
        <div className='explorer-button-group__toaster-text'>
          <div> {this.state.toasterHeadline} </div>
          { (Object.values(this.state.downloadingInProgress).some((x) => x === true))
            ? <div> { this.state.downloadingInProgressToasterText } </div>
            : null}
          { (this.state.exportWorkspaceFileName)
            ? <div> Most recent Workspace file name: { this.state.exportWorkspaceFileName } </div>
            : null}
          { (this.state.exportPFBURL)
            ? <a className='explorer-button-group__toaster-dl-link' href={this.state.exportPFBURL} download>Click here to download your PFB.</a>
            : null}
          { (this.state.exportPFBToWorkspaceGUID)
            ? <div>{ this.state.exportPFBToWorkspaceGUID } </div>
            : null}
          { (this.state.toasterError)
            ? <div> Error: { this.state.toasterError } </div>
            : null}
          { (this.isPFBRunning())
            ? <div> { this.state.pfbWarning } </div>
            : null}
        </div>
      }
    </Toaster>
  ));

  getFileCountSum = async () => {
    try {
      const { dataType } = this.props.guppyConfig;
      const { fileCountField } = this.props.guppyConfig;
      const query = `query ($filter: JSON) {
        _aggregation {
          ${dataType} (filter: $filter) {
            ${fileCountField} {
              histogram {
                sum
              }
            }
          }
        }
      }`;
      const body = { query, variables: { filter: getGQLFilter(this.props.filter) } };
      const res = await fetchWithCreds({
        path: guppyGraphQLUrl,
        method: 'POST',
        body: JSON.stringify(body),
      });
      // eslint-disable-next-line no-underscore-dangle
      const totalFileCount = res.data.data._aggregation[dataType][fileCountField].histogram[0].sum;
      return totalFileCount;
    } catch (err) {
      throw Error('Error when getting total file count');
    }
  };

  fetchJobResult = async () => this.props.fetchJobResult(this.props.job.uid);

  isPFBRunning = () => this.props.job && this.props.job.status === 'Running';

  gotoWorkspace = () => this.props.history.push('/workspace');

  closeToaster = () => {
    this.setState({
      toasterOpen: false,
      toasterHeadline: '',
      toasterError: null,
      exportPFBURL: '',
    });
  };

  downloadData = (filename, fileFormat) => () => {
    this.setState({ downloadingInProgress: { data: true }, toasterOpen: true });
    const fileTypeKey = fileFormat.toLowerCase();
    const isJsonFormat = fileTypeKey === 'json' || fileTypeKey === 'data';
    const queryArgObj = {};
    if (fileTypeKey !== 'data') {
      queryArgObj.format = fileTypeKey;
    }
    this.props.downloadRawData(queryArgObj).then((res) => {
      if (res) {
        const blob = new Blob([isJsonFormat ? JSON.stringify(res, null, 2) : res], { type: `text/${isJsonFormat ? 'json' : fileTypeKey}` });
        FileSaver.saveAs(blob, filename);
      } else {
        throw Error('Error when downloading data');
      }
      this.setState({ downloadingInProgress: { data: false }, toasterOpen: false });
    });
  };

  downloadManifest = (filename, indexType) => async () => {
    if (indexType === 'file') {
      this.setState({ downloadingInProgress: { fileManifest: true }, toasterOpen: true });
    } else {
      this.setState({ downloadingInProgress: { manifest: true }, toasterOpen: true });
    }

    const resultManifest = await this.getManifest(indexType);
    if (resultManifest) {
      const blob = new Blob([JSON.stringify(resultManifest, null, 2)], { type: 'text/json' });
      FileSaver.saveAs(blob, filename);
    } else {
      throw Error('Error when downloading manifest');
    }
    if (indexType === 'file') {
      this.setState({ downloadingInProgress: { fileManifest: false }, toasterOpen: false });
    } else {
      this.setState({ downloadingInProgress: { manifest: false }, toasterOpen: false });
    }
  };

  // REMOVE THIS CODE ONCE TERRA EXPORT WORKS
  // =========================================
  // The below code is a temporary feature for for https://ctds-planx.atlassian.net/browse/PXP-5186
  // (Warn user about Terra entity threshold). This code should be removed when
  // Terra is no longer limited to importing <165,000 entities. (~14k subjects).
  // This file is the only file that contains code for this feature.
  exportToTerraWithWarning = () => {
    // If the number of subjects is over the threshold, warn the user that their
    // export to Terra job might fail.
    if (this.props.totalCount >= terraExportWarning.subjectThreshold) {
      this.setState({ enableTerraWarningPopup: true });
    } else {
      // If the number is below the threshold, proceed as normal
      this.exportToTerra();
    }
  }

  exportFilesToTerraWithWarning = () => {
    // If the number of subjects is over the threshold, warn the user that their
    // export to Terra job might fail.
    if (this.props.totalCount >= terraExportWarning.subjectThreshold) {
      this.setState({ enableTerraWarningPopup: true });
    } else {
      // If the number is below the threshold, proceed as normal
      this.exportFilesToTerra();
    }
  }
  // ==========================================

  exportToTerra = () => {
    this.setState({ exportingToTerra: true }, () => {
      this.exportToPFB();
    });
  };

  exportFilesToTerra = () => {
    this.setState({ exportingToTerra: true }, () => {
      this.exportFilesToPFB();
    });
  };

  exportToSevenBridges = () => {
    this.setState({ exportingToSevenBridges: true }, () => {
      this.exportToPFB();
    });
  }

  // This is a generic way to export a PFB to a third party, deprecating
  // exportToTerra and exportToSevenBridges.
  // See docs/export-pfb-to-url.md
  // Code flow (it's confusing):
  // 1. User clicks a 'export-pfb-to-url' button
  // 2. Store target URL as state.targetURLTemplate
  // 2. Kick off a PFB export job with this.exportToPFB()
  // 3. componentDidUpdate polls the exportToPFB job status, when complete it will call
  //    sendPFBToURL(this.state.targetURLTemplate)
  exportPFBToURL = (targetURLTemplate) => () => {
    this.setState({
      exportingPFBToURL: true,
      targetURLTemplate,
    }, () => {
      this.exportToPFB();
    });
  }

  sendPFBToURL = (targetURLTemplate, presignedURL) => {
    const signedURL = encodeURIComponent(presignedURL);
    // the PFB export target URL is a template URL that should have a {{PRESIGNED_URL}} template
    // variable in it.
    const targetURL = targetURLTemplate.replace(PRESIGNED_URL_TEMPLATE_VARIABLE, signedURL);
    window.location = targetURL;
  }

  exportFilesToSevenBridges = () => {
    this.setState({ exportingToSevenBridges: true }, () => {
      this.exportFilesToPFB();
    });
  }

  sendPFBToTerra = () => {
    const url = encodeURIComponent(this.state.exportPFBURL);
    let templateParam = '';
    if (typeof this.props.buttonConfig.terraTemplate !== 'undefined'
      && this.props.buttonConfig.terraTemplate != null) {
      templateParam = this.props.buttonConfig.terraTemplate.map(
        (x) => `&template=${x}`,
      ).join('');
    }
    window.location = `${this.props.buttonConfig.terraExportURL}?format=PFB${templateParam}&url=${url}`;
  }

  sendPFBToWorkspace = (pfbGUID) => {
    const JSONBody = { guid: pfbGUID };
    fetchWithCreds({
      path: `${manifestServiceApiPath}cohorts`,
      body: JSON.stringify(JSONBody),
      method: 'POST',
    })
      .then(
        ({ status, data }) => {
          const errorMsg = (data.error ? data.error : '');
          switch (status) {
          case 200:
            this.setState((prevState) => ({
              exportingPFBToWorkspace: false,
              exportPFBToWorkspaceGUID: pfbGUID,
              toasterOpen: true,
              toasterHeadline: prevState.pfbToWorkspaceSuccessText,
              exportPFBToWorkspaceStatus: status,
            }));
            return;
          default:
            this.setState({
              exportingPFBToWorkspace: false,
              exportPFBToWorkspaceGUID: '',
              toasterOpen: true,
              toasterHeadline: `There was an error exporting your cohort (${status}). ${errorMsg}`,
              exportPFBToWorkspaceStatus: status,
            });
          }
        },
      );
  }

  sendPFBToSevenBridges = () => {
    const url = encodeURIComponent(this.state.exportPFBURL);
    window.location = `${this.props.buttonConfig.sevenBridgesExportURL}?format=PFB&url=${url}`;
  }

  exportToPFB = () => {
    this.props.submitJob({ action: 'export', input: { filter: getGQLFilter(this.props.filter) } });
    this.props.checkJobStatus();
    this.setState((prevState) => ({
      toasterOpen: true,
      toasterHeadline: prevState.pfbStartText,
    }));
  };

  exportFilesToPFB = () => {
    if (this.props.buttonConfig.enableLimitedFilePFBExport) {
      if (!this.state.sourceNodesInCohort || this.state.sourceNodesInCohort.length !== 1) {
        return;
      }
      const rootNode = this.state.sourceNodesInCohort[0];
      this.props.submitJob({
        action: 'export-files',
        input: {
          filter: getGQLFilter(this.props.filter),
          root_node: rootNode,
        },
      });
      this.props.checkJobStatus();
      this.setState((prevState) => ({
        toasterOpen: true,
        toasterHeadline: prevState.pfbStartText,
      }));
    } else {
      /* eslint-disable no-console */
      console.error(`Error: Missing \`enableLimitedFilePFBExport\` in the portal config.
Currently, in order to export a File PFB, \`enableLimitedFilePFBExport\` must be set in the portal config.`);
    }
  };

  exportPFBToWorkspace = () => {
    this.props.submitJob({ action: 'export', access_format: 'guid', input: { filter: getGQLFilter(this.props.filter) } });
    this.props.checkJobStatus();
    this.setState((prevState) => ({
      toasterOpen: true,
      toasterHeadline: prevState.pfbStartText,
      exportingPFBToWorkspace: true,
    }));
  }

  exportToWorkspace = async (indexType) => {
    this.setState({ exportingToWorkspace: true });
    const resultManifest = await this.getManifest(indexType);
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
      this.exportToWorkspaceMessageHandler(400, 'There were no data files found matching the cohort you created.');
    }
  };

  exportToWorkspaceSuccessHandler = (data) => {
    this.setState((prevState) => ({
      toasterOpen: true,
      toasterHeadline: prevState.workspaceSuccessText,
      exportWorkspaceStatus: 200,
      exportingToWorkspace: false,
      exportWorkspaceFileName: data.filename,
    }));
  };

  exportToWorkspaceErrorHandler = (status) => {
    this.setState((prevState) => ({
      toasterOpen: true,
      toasterHeadline: prevState.toasterErrorText,
      exportWorkspaceStatus: status,
      exportingToWorkspace: false,
    }));
  };

  exportToWorkspaceMessageHandler = (status, message) => {
    this.setState({
      toasterOpen: true,
      toasterHeadline: message,
      exportWorkspaceStatus: status,
      exportingToWorkspace: false,
    });
  };

  isFileButton = (buttonConfig) => buttonConfig.type === 'manifest'
    || buttonConfig.type === 'export'
    || buttonConfig.type === 'export-to-seven-bridges'
    || buttonConfig.type === 'export-to-workspace'
    || buttonConfig.type === 'export-to-pfb'
    || buttonConfig.type === 'export-pfb-to-workspace';

  refreshManifestEntryCount = async () => {
    if (this.props.isLocked || !this.props.guppyConfig.manifestMapping
      || !this.props.guppyConfig.manifestMapping.referenceIdFieldInDataIndex
      || !this.props.guppyConfig.manifestMapping.referenceIdFieldInResourceIndex) return;
    const caseField = this.props.guppyConfig.manifestMapping.referenceIdFieldInDataIndex;
    const caseFieldInFileIndex = this.props.guppyConfig.manifestMapping.referenceIdFieldInResourceIndex;
    if (this.props.buttonConfig
      && this.props.buttonConfig.buttons
      && this.props.buttonConfig.buttons.some(
        (btnCfg) => this.isFileButton(btnCfg) && btnCfg.enabled)) {
      if (this.props.guppyConfig.fileCountField) {
        // if "fileCountField" is set, just ask for sum of file_count field
        const totalFileCount = await this.getFileCountSum();
        this.setState(() => ({
          manifestEntryCount: totalFileCount,
        }));
      } else {
        // otherwise, just query subject index for subject_id list,
        // and query file index for manifest info.
        this.setState({
          manifestEntryCount: 0,
        });
        const caseIDResult = await this.props.downloadRawDataByFields({ fields: [caseField] });
        if (caseIDResult) {
          let caseIDList = caseIDResult.map((i) => i[caseField]);
          caseIDList = _.uniq(caseIDList);
          const fileType = this.props.guppyConfig.manifestMapping.resourceIndexType;
          const countResult = await this.props.getTotalCountsByTypeAndFilter(fileType, {
            [caseFieldInFileIndex]: {
              selectedValues: caseIDList,
            },
          });
          this.setState({
            manifestEntryCount: countResult,
          });
        } else {
          throw Error('Error when downloading data');
        }
      }
    }
  };

  refreshSourceNodes = async (filter, sourceNodeField) => {
    try {
      const indexType = this.props.guppyConfig.dataType;
      const query = `query ($filter: JSON) {
        _aggregation {
          ${indexType} (filter: $filter) {
            ${sourceNodeField} {
              histogram {
                key
                count
              }
            }
          }
        }
      }`;
      const body = { query, variables: { filter: getGQLFilter(filter) } };
      const res = await fetchWithCreds({
        path: guppyGraphQLUrl,
        method: 'POST',
        body: JSON.stringify(body),
      });
      // eslint-disable-next-line no-underscore-dangle
      const sourceNodesHistogram = res.data.data._aggregation[indexType][sourceNodeField].histogram;
      const sourceNodes = [];
      sourceNodesHistogram.forEach(({ key, count }) => {
        if (count > 0) {
          sourceNodes.push(key);
        }
      });
      this.setState({
        sourceNodesInCohort: sourceNodes,
      });
    } catch (err) {
      throw Error(`Error when getting data types: ${err}`);
    }
  };

  // check if the user has access to this resource
  isButtonDisplayed = (buttonConfig) => {
    if (buttonConfig.type === 'export-to-workspace' || buttonConfig.type === 'export-files-to-workspace' || buttonConfig.type === 'export-pfb-to-workspace') {
      const authResult = this.props.userAccess.Workspace;
      return typeof authResult !== 'undefined' ? authResult : true;
    }

    return true;
  };

  isButtonEnabled = (buttonConfig) => {
    if (this.props.isLocked) {
      return !this.props.isLocked;
    }
    if (buttonConfig.type.startsWith('data') || buttonConfig.type === 'manifest' || buttonConfig.type === 'file-manifest') {
      let isEnabled = Object.values(this.state.downloadingInProgress).every((x) => x === false);
      if (buttonConfig.type === 'manifest') {
        isEnabled = isEnabled && this.state.manifestEntryCount > 0;
      }
      return isEnabled;
    }

    const pfbJobIsRunning = this.state.exportingToTerra
    || this.state.exportingToSevenBridges
    || this.state.exportingPFBToURL
    || this.isPFBRunning();
    if (buttonConfig.type === 'export-to-pfb') {
      // disable the pfb export button if any other pfb export jobs are running
      return !pfbJobIsRunning;
    }
    if (buttonConfig.type === 'export-files-to-pfb') {
      // disable the pfb export button if any other pfb export jobs are running
      if (pfbJobIsRunning) {
        return false;
      }
      // If limited file PFB export is enabled, disable the button if the selected
      // data files are on more than one source node. (See https://github.com/uc-cdis/data-portal/pull/729)
      if (this.props.buttonConfig.enableLimitedFilePFBExport) {
        return this.state.sourceNodesInCohort.length === 1;
      }
    }
    if (buttonConfig.type === 'export-pfb-to-workspace') {
      // disable the pfb export button if any other pfb export jobs are running
      if (pfbJobIsRunning) {
        return false;
      }
      // If limited file PFB export is enabled, disable the button if the selected
      // data files are on more than one source node. (See https://github.com/uc-cdis/data-portal/pull/729)
      if (this.props.buttonConfig.enableLimitedFilePFBExport) {
        return this.state.sourceNodesInCohort.length === 1;
      }
    }
    if (buttonConfig.type === 'export-pfb-to-url') {
      return !pfbJobIsRunning;
    }
    if (buttonConfig.type === 'export') {
      // disable the terra export button if any of the
      // pfb export operations are running.
      return !pfbJobIsRunning;
    }
    if (buttonConfig.type === 'export-files') {
      // disable the terra export button if any of the
      // pfb export operations are running.
      if (pfbJobIsRunning) {
        return false;
      }
      // If limited file PFB export is enabled, disable the button if the selected
      // data files are on more than one source node. (See https://github.com/uc-cdis/data-portal/pull/729)
      if (this.props.buttonConfig.enableLimitedFilePFBExport) {
        return this.state.sourceNodesInCohort.length === 1;
      }
    }
    if (buttonConfig.type === 'export-to-seven-bridges') {
      // disable the seven bridges export buttons if any of the
      // pfb export operations are running.
      return !pfbJobIsRunning;
    }
    if (buttonConfig.type === 'export-files-to-seven-bridges') {
      // disable the seven bridges export buttons if any of the
      // pfb export operations are running.
      if (pfbJobIsRunning) {
        return false;
      }
      // If limited file PFB export is enabled, disable the button if the selected
      // data files are on more than one source node. (See https://github.com/uc-cdis/data-portal/pull/729)
      if (this.props.buttonConfig.enableLimitedFilePFBExport) {
        return this.state.sourceNodesInCohort.length === 1;
      }
    }
    if (buttonConfig.type === 'export-to-workspace') {
      return this.state.manifestEntryCount > 0;
    }

    return this.props.totalCount > 0;
  };

  isButtonPending = (buttonConfig) => {
    if (this.props.isPending) {
      return true;
    }
    if (buttonConfig.type.startsWith('data')) {
      return this.state.downloadingInProgress.data;
    }
    if (buttonConfig.type === 'manifest') {
      return this.state.downloadingInProgress.manifest;
    }
    if (buttonConfig.type === 'file-manifest') {
      return this.state.downloadingInProgress.fileManifest;
    }
    if (buttonConfig.type === 'export-to-workspace' || buttonConfig.type === 'export-files-to-workspace') {
      return this.state.exportingToWorkspace;
    }
    if (buttonConfig.type === 'export-to-pfb' || buttonConfig.type === 'export-files-to-pfb') {
      // export to pfb button is pending if a pfb export job is running and it's
      // neither an export to terra job or an export to seven bridges job.
      return this.isPFBRunning()
        && !(this.state.exportingToTerra || this.state.exportingToSevenBridges || this.state.exportingPFBToURL);
    }
    if (buttonConfig.type === 'export' || buttonConfig.type === 'export-files') {
      // export to terra button is pending if a pfb export job is running and
      // it's an exporting to terra job.
      return this.isPFBRunning()
        && this.state.exportingToTerra;
    }
    if (buttonConfig.type === 'export-to-seven-bridges' || buttonConfig.type === 'export-files-to-seven-bridges') {
      // export to seven bridges button is pending if a pfb export job is running
      // and it's an export to seven bridges job.
      return this.isPFBRunning()
        && this.state.exportingToSevenBridges;
    }
    if (buttonConfig.type === 'export-pfb-to-url') {
      return this.isPFBRunning()
        && this.state.exportingPFBToURL
        // because we can have multiple `export-pfb-to-url` buttons, only make the
        // one the user clicked have the pending state.
        && this.state.targetURLTemplate === buttonConfig.targetURLTemplate;
    }
    return false;
  };

  renderButton = (buttonConfig) => {
    if (!this.isButtonDisplayed(buttonConfig)) {
      return null;
    }

    const clickFunc = this.getOnClickFunction(buttonConfig);
    let buttonTitle = buttonConfig.title;
    if (buttonConfig.type === 'data') {
      const buttonCount = (this.props.totalCount >= 0) ? this.props.totalCount : 0;
      buttonTitle = `${buttonConfig.title} (${buttonCount})`;
    } else if (buttonConfig.type === 'manifest' && this.state.manifestEntryCount > 0) {
      buttonTitle = `${buttonConfig.title} (${humanizeNumber(this.state.manifestEntryCount)})`;
    }

    let tooltipEnabled = buttonConfig.tooltipText ? !this.isButtonEnabled(buttonConfig) : false;
    let btnTooltipText = (this.props.isLocked) ? 'You only have access to summary data' : buttonConfig.tooltipText;

    // If limited file PFB export is enabled, PFB export buttons will be disabled
    // if the user selects multiple files that are on different nodes in the graph.
    // (See https://github.com/uc-cdis/data-portal/pull/729).
    // If the user has selected multiple files on different nodes, display a
    // tooltip explaining that the user can only export files of the same type.
    const isFilePFBButton = buttonConfig.type === 'export-files' || buttonConfig.type === 'export-files-to-pfb' || buttonConfig.type === 'export-files-to-seven-bridges';
    if (this.props.buttonConfig.enableLimitedFilePFBExport
      && isFilePFBButton
      && this.state.sourceNodesInCohort.length > 1) {
      tooltipEnabled = true;
      btnTooltipText = 'Currently you cannot export files with different Data Types. Please choose a single Data Type from the Data Type filter on the left.';
    }

    return (
      <Button
        key={`${buttonConfig.type}-${buttonConfig.title}`}
        onClick={() => ((!this.props.user.username && this.isLoginForDownloadEnabled()
          && this.isDownloadButton(buttonConfig)) ? this.goToLogin() : clickFunc())}
        label={(!this.props.user.username && this.isLoginForDownloadEnabled()
          && this.isDownloadButton(buttonConfig)) ? `Login to ${buttonTitle.toLowerCase()}` : buttonTitle}
        leftIcon={buttonConfig.leftIcon}
        rightIcon={buttonConfig.rightIcon}
        className='explorer-button-group__download-button'
        buttonType='primary'
        enabled={this.isButtonEnabled(buttonConfig)}
        tooltipEnabled={tooltipEnabled}
        tooltipText={btnTooltipText}
        isPending={this.isButtonPending(buttonConfig)}
      />
    );
  };

  isLoginForDownloadEnabled = () => this.props.buttonConfig.loginForDownload;

  goToLogin = () => {
    if (!this.props.user || !this.props.user.username) {
      this.props.history.push('/login', { from: `${this.props.location.pathname}` });
    }
  }

  isDownloadButton = (buttonConfig) => (
    buttonConfig.type.startsWith('data')
    || buttonConfig.type === 'manifest'
    || buttonConfig.type === 'file-manifest');

  render() {
    const dropdownConfigs = calculateDropdownButtonConfigs(this.props.buttonConfig);
    return (
      <React.Fragment>
        {
          // REMOVE THIS CODE WHEN EXPORT TO TERRA WORKS
          // ===========================================
          this.state.enableTerraWarningPopup
            && (
              <Popup
                message={terraExportWarning.message
                  ? [terraExportWarning.message]
                  : [`Warning: You have selected more subjects than are currently supported. The import may not succeed. Terra recommends slicing your data into segments of no more than ${terraExportWarning.subjectThreshold.toLocaleString()} subjects and exporting each separately. Would you like to continue anyway?`]}
                title={terraExportWarning.title
                  ? terraExportWarning.title
                  : 'Warning: Export May Fail'}
                rightButtons={[
                  {
                    caption: 'Yes, Export Anyway',
                    fn: () => {
                      this.setState({ enableTerraWarningPopup: false });
                      this.exportToTerra();
                    },
                    icon: 'external-link',
                  },
                ]}
                leftButtons={[
                  {
                    caption: 'Cancel',
                    fn: () => this.setState({ enableTerraWarningPopup: false }),
                    icon: 'cross',
                  },
                ]}
                onClose={() => this.setState({ enableTerraWarningPopup: false })}
              />
            )
          // ===========================================
        }
        {
          /*
          * First, render dropdown buttons
          * Buttons are grouped under same dropdown if they have the same dropdownID
          * If only one button points to the same dropdownId, it won't be grouped into dropdown
          *   but will only be rendered as single normal button instead.
          */
          dropdownConfigs && Object.keys(dropdownConfigs).length > 0
          && Object.keys(dropdownConfigs)
            .filter((dropdownId) => (dropdownConfigs[dropdownId].cnt > 1))
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
                  <Dropdown.Button>{(!this.props.user.username && this.isLoginForDownloadEnabled())
                             ? `Login to ${dropdownTitle.toLowerCase()}` : dropdownTitle}</Dropdown.Button>
                  <Dropdown.Menu>
                    {
                      btnConfigs.map((btnCfg) => {
                        const onClick = this.getOnClickFunction(btnCfg);
                        return (
                          <Dropdown.Item
                            key={`${btnCfg.type}-${btnCfg.title}`}
                            leftIcon={btnCfg.leftIcon}
                            rightIcon={btnCfg.rightIcon}
                            onClick={() => ((!this.props.user.username && this.isLoginForDownloadEnabled()
                              && this.isDownloadButton(btnCfg)) ? this.goToLogin() : onClick())}
                          >
                            {(!this.props.user.username && this.isLoginForDownloadEnabled()
                            && this.isDownloadButton(btnCfg)) ? `Login to download ${btnCfg.title}` : btnCfg.title}
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
            .filter((buttonConfig) => !dropdownConfigs
              || !buttonConfig.dropdownId
              || (dropdownConfigs[buttonConfig.dropdownId].cnt === 1),
            )
            .filter((buttonConfig) => buttonConfig.enabled)
            .map((buttonConfig) => this.renderButton(buttonConfig))
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
  isPending: PropTypes.bool,
  buttonConfig: ButtonConfigType.isRequired,
  guppyConfig: GuppyConfigType.isRequired,
  history: PropTypes.object.isRequired,
  submitJob: PropTypes.func.isRequired,
  resetJobState: PropTypes.func.isRequired,
  checkJobStatus: PropTypes.func.isRequired,
  fetchJobResult: PropTypes.func.isRequired,
  isLocked: PropTypes.bool.isRequired,
  userAccess: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

ExplorerButtonGroup.defaultProps = {
  job: null,
  isPending: false,
};

export default ExplorerButtonGroup;
