import React from 'react';
import FileSaver from 'file-saver';
import _ from 'lodash';
import Button from '@gen3/ui-component/dist/components/Button';
import Dropdown from '@gen3/ui-component/dist/components/Dropdown';
import Toaster from '@gen3/ui-component/dist/components/Toaster';
import { getGQLFilter } from '@gen3/guppy/dist/components/Utils/queries';
import PropTypes from 'prop-types';
import { calculateDropdownButtonConfigs, humanizeNumber } from '../../DataExplorer/utils';
import { ButtonConfigType, GuppyConfigType } from '../configTypeDef';
import { fetchWithCreds } from '../../actions';
import { manifestServiceApiPath, guppyGraphQLUrl, terraExportWarning } from '../../localconf';
import './ExplorerButtonGroup.css';
import Popup from '../../components/Popup';

const enableFilePFBExport = true;

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
      exportingToTerra: false,
      exportingToSevenBridges: false,
      // for export to PFB
      exportPFBStatus: null,
      exportPFBURL: '',
      pfbStartText: 'Your export is in progress.',
      pfbWarning: 'Please do not navigate away from this page until your export is finished.',
      pfbSuccessText: 'Your cohort has been exported to PFB! The URL is displayed below.',
      // for export to PFB in Files tab
      sourceNodesInCohort: [],
      // for export to workspace
      exportingToWorkspace: false,
      exportWorkspaceFileName: null,
      exportWorkspaceStatus: null,
      workspaceSuccessText: 'Your cohort has been saved! In order to view and run analysis on this cohort, please go to the workspace.',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.job && nextProps.job.status === 'Completed' && this.props.job.status !== 'Completed') {
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
          } else {
            this.setState({
              exportPFBURL: `${res.data.output}`.split('\n'),
              toasterOpen: true,
              toasterHeadline: this.state.pfbSuccessText,
            });
          }
        });
    }
    // FIXME @mpingram we do not need to run this unless in the Data tab
    // Disabling for development
    // if (nextProps.totalCount !== this.props.totalCount
    //   && nextProps.totalCount) {
    //   this.refreshManifestEntryCount();
    // }
    // NOTE (mpingram) if PFB export is enabled in the Files tab, we need to
    // only allow the user to export a PFB when
    // nextProps.filter is an object my dude
    if (enableFilePFBExport && nextProps.filter !== this.props.filter) {
      this.refreshSourceNodes(nextProps.filter);
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
      clickFunc = this.downloadManifest(buttonConfig.fileName, null);
    }
    if (buttonConfig.type === 'file-manifest') {
      clickFunc = this.downloadManifest(buttonConfig.fileName, 'file');
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
    if (buttonConfig.type === 'export-to-seven-bridges') {
      clickFunc = this.exportToSevenBridges;
    }
    if (buttonConfig.type === 'export-to-pfb') {
      clickFunc = this.exportToPFB;
    }
    if (buttonConfig.type === 'export-to-workspace') {
      clickFunc = this.exportToWorkspace;
    }
    if (buttonConfig.type === 'export-files-to-workspace') {
      clickFunc = () => this.exportToWorkspace('file');
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
      .then(res => res.map(i => i[refField]));
    refIDList = _.uniq(refIDList);
    const refFieldInResourceIndex =
      this.props.guppyConfig.manifestMapping.referenceIdFieldInResourceIndex;
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
      x => !!x[resourceFieldInResourceIndex],
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


  getFileCountSum = async () => {
    try {
      const dataType = this.props.guppyConfig.dataType;
      const fileCountField = this.props.guppyConfig.fileCountField;
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
      exportPFBStatus: null,
      exportPFBURL: '',
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

  downloadManifest = (filename, indexType) => async () => {
    const resultManifest = await this.getManifest(indexType);
    if (resultManifest) {
      const blob = new Blob([JSON.stringify(resultManifest, null, 2)], { type: 'text/json' });
      FileSaver.saveAs(blob, filename);
    } else {
      throw Error('Error when downloading manifest');
    }
  };

  // REMOVE THIS CODE ONCE TERRA EXPORT WORKS
  // =========================================
  // The below code is a temporary feature for for https://ctds-planx.atlassian.net/browse/PXP-5186
  // (Warn user about Terra entitiy threshold). This code should be removed when
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
  // ==========================================

  exportToTerra = () => {
    this.setState({ exportingToTerra: true }, () => {
      this.exportToPFB();
    });
  };

  exportToSevenBridges = () => {
    this.setState({ exportingToSevenBridges: true }, () => {
      this.exportToPFB();
    });
  }

  sendPFBToTerra = () => {
    const url = encodeURIComponent(this.state.exportPFBURL);
    let templateParam = '';
    if (typeof this.props.buttonConfig.terraTemplate !== 'undefined'
      && this.props.buttonConfig.terraTemplate != null) {
      templateParam = this.props.buttonConfig.terraTemplate.map(
        x => `&template=${x}`,
      ).join('');
    }
    window.location = `${this.props.buttonConfig.terraExportURL}?format=PFB${templateParam}&url=${url}`;
  }

  sendPFBToSevenBridges = () => {
    const url = encodeURIComponent(this.state.exportPFBURL);
    window.location = `${this.props.buttonConfig.sevenBridgesExportURL}?format=PFB&url=${url}`;
  }

  exportToPFB = () => {
    if (enableFilePFBExport) {
      // FIXME @mpingram how can we get the root_node for this filter....
      // This is rough but it could be something like this.props.getRootNodes(this.props.filter)
      // Or is there a way to access the raw data?
      // In which case getRootNodes(this.props.rawData)
      // And if it returns more than one root node, then disable the explorer button,
      // otherwise use that root node as the input to the export-files
      // NOTE @mpingram -- potential issue here -- if we grey out the button based on root node,
      // then if someone DOES manage to stick a file where it doesn't belong
      // then no one can export a file of that type at all. Hemm.\
      //
      // Ok, realistically what we might want is this behavior:
      // - I've selected a cohort of all file types on multiple random nodes. Export button is greyed out.
      // - I've selected a cohort of CRAM files, one of which happens to be on reference_file, but all others are on
      //    submitted_aligned_reads where they belong. I want to be able to export my normal CRAM files and be warned
      //    that there's this rogue CRAM file that I'll need to export separately.
      //    - in other words, if cohort is on 2 nodes and one of them is reference_file? But then a selection of
      //    msVCFs and CRAM files is ok ... facepalm
      //    - ok, if cohort is all of the same data type, is on 2 nodes, and one of the nodes is reference_file, then
      //    warn the user but allow export.
      // - I've seleced a cohort of CRAM files and they're all on submitted_aligned_reads. Everything is good.
      // - We could also have a configurable mapping of data types to root nodes. Now that's an awful idea that could work...
      //    except now there's no way to export a CRAM file that happens to be on reference_file.
      //
      // ===========================================
      // That's a good 'patch job  solution though.
      //   - Disable button if multiple data types are selected.
      //   - Have a configurable mapping from data types to a single root node.
      //   - Dispatch the 'export-file' job with the root node from the mapping.
      // UPSIDE: No ETL changes required to deploy
      // DOWNSIDE: If someone does manage to upload a file to the wrong node (eg CRAM file to reference_file), it's
      // no longer possible to export that file.
      // DOWNSIDE: Requires us to maintain the mapping from data types to root nodes.
      // This is something that could easily break without us noticing...
      // -- ooh, if we do a slight modification to this but ETL the root node and restrict export button to only
      // single root node, no warnings, then... it's possible to download the files on reference_file now if you
      // exclude them from the search... hm hm hm ok again we would need to say "if your cohort has one data type and
      // two root_nodes and one of the root_nodes is 'reference_file' then use just the other root_node"
      // If pelican can't find an entity ID on the root node what happens? Does it fail silently? I think it does.ß
      // ===========================================
      //
      // If a file is on one or more root_nodes, we just can't do it. It's not friggin possible.
      // The user needs to export files from each root_node at a time. BUT, if someone does
      // stick a CRAM on reference_file in a stduy, then we CAN'T actually export ALL cram files
      // from that study
      // OK ANOTHER OPTION has just opened up -- we can in fact include a source node filter and
      // rewrite the values, eg 'reference_file', to make more sense, eg 'miscellaneous'.
      // Does this help us? Well, yes because now at least if someone sticks a CRAM file on reference_node
      // it will show up under 'miscellaneous' in the filters.
      // The downside is that this involves essentially removing the 'Data Type' filter from the
      // filters and replacing it with a similar but slightly different filter -- will this confuse anyone?
      // Yes, it absolutely will -- now there's no way to select msVCFs vs Unharmonized Clinical data that's on
      // reference file, that's like removing half the functionality of the file filters.
      // Ok,
      // so we might need both filters? But ugh, that's gross, having a second data type filter essentially that's
      // just there so that the user can export files ............. uhhhhhhhhhhhhhhhhggghhghghhgghghghghhghghhhhg
      if (!this.state.sourceNodesInCohort || this.state.sourceNodesInCohort.length !== 1) {
        console.error(`User tried to export a File PFB, but there are ${this.state.sourceNodesInCohort.length} data types in the cohort! (Expected 1 data type)`);
        return;
      }
      const rootNode = this.state.sourceNodesInCohort[0];
      console.log('submitting job w/ payload:', {
        action: 'export-files',
        input: {
          filter: getGQLFilter(this.props.filter),
          root_node: rootNode,
        },
      });
      this.props.submitJob({
        action: 'export-files',
        input: {
          filter: getGQLFilter(this.props.filter),
          root_node: rootNode,
        },
      });
    } else {
      this.props.submitJob({ action: 'export', input: { filter: getGQLFilter(this.props.filter) } });
    }
    this.props.checkJobStatus();
    this.setState({
      toasterOpen: true,
      toasterHeadline: this.state.pfbStartText,
    });
  };

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
    buttonConfig.type === 'export-to-seven-bridges' ||
    buttonConfig.type === 'export-to-workspace' ||
    buttonConfig.type === 'export-to-pfb';

  refreshManifestEntryCount = async () => {
    if (this.props.isLocked || !this.props.guppyConfig.manifestMapping
      || !this.props.guppyConfig.manifestMapping.referenceIdFieldInDataIndex
      || !this.props.guppyConfig.manifestMapping.referenceIdFieldInResourceIndex) return;
    const caseField = this.props.guppyConfig.manifestMapping.referenceIdFieldInDataIndex;
    const caseFieldInFileIndex =
      this.props.guppyConfig.manifestMapping.referenceIdFieldInResourceIndex;
    if (this.props.buttonConfig
      && this.props.buttonConfig.buttons
      && this.props.buttonConfig.buttons.some(
        btnCfg => this.isFileButton(btnCfg) && btnCfg.enabled)) {
      if (this.props.guppyConfig.fileCountField) {
        console.log('file count field is set');
        // if "fileCountField" is set, just ask for sum of file_count field
        const totalFileCount = await this.getFileCountSum();
        this.setState(() => ({
          manifestEntryCount: totalFileCount,
        }));
      } else {
        console.log('file count field is not set. GuppyConfig:', this.props.guppyConfig);
        // otherwise, just query subject index for subject_id list,
        // and query file index for manifest info.
        this.setState({
          manifestEntryCount: 0,
        });
        const caseIDResult = await this.props.downloadRawDataByFields({ fields: [caseField] });
        if (caseIDResult) {
          let caseIDList = caseIDResult.map(i => i[caseField]);
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

  refreshSourceNodes = async (filter) => {
    try {
      const SOURCE_NODE_FIELD = 'source_node';
      const indexType = this.props.guppyConfig.dataType;
      const sourceNodeField = SOURCE_NODE_FIELD;
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
      // console.log('dataTypesResponse', res);
      // console.log('dataTypesHistogram', dataTypesHistogram);
      const sourceNodes = [];
      sourceNodesHistogram.forEach(({ key, count }) => {
        if (count > 0) {
          sourceNodes.push(key);
        }
      });
      console.log('sourceNodes', sourceNodes);
      this.setState({
        sourceNodesInCohort: sourceNodes,
      });
    } catch (err) {
      throw Error(`Error when getting data types: ${err}`);
    }
  };

  // check if the user has access to this resource
  isButtonDisplayed = (buttonConfig) => {
    if (buttonConfig.type === 'export-to-workspace' || buttonConfig.type === 'export-files-to-workspace') {
      const authResult = this.props.userAccess.Workspace;
      return typeof authResult !== 'undefined' ? authResult : true;
    }

    return true;
  };

  isButtonEnabled = (buttonConfig) => {
    if (this.props.isLocked) {
      return !this.props.isLocked;
    }
    // Disable PFB export buttons if user is trying to export files that are on different nodes
    // in the graph.
    // NOTE @mpingram this is a hack put in place due to the pelican-export job only supporting
    // creating PFBs where all entities are on the same node. If the pelican-export job is changed
    // to support creating PFBs where entities can be from multiple nodes, this code should be removed.
    // -------
    if (enableFilePFBExport) {
      if (buttonConfig.type === 'export'
      || buttonConfig.type === 'export-to-pfb'
      || buttonConfig.type === 'export-to-seven-bridges') {
        // enable the button only if the cohort is all of the same data type
        return this.state.sourceNodesInCohort.length === 1;
      }
    }
    // -------
    if (buttonConfig.type === 'manifest') {
      return this.state.manifestEntryCount > 0;
    }
    if (buttonConfig.type === 'export-to-pfb') {
      // disable the pfb export button if any other pfb export jobs are running
      return !(this.state.exportingToTerra || this.state.exportingToSevenBridges);
    }
    if (buttonConfig.type === 'export') {
      if (!this.props.buttonConfig.terraExportURL) {
        console.error('Export to Terra button is present, but there is no `terraExportURL` specified in the portal config. Disabling the export to Terra button.'); // eslint-disable-line no-console
        return false;
      }
      // disable the terra export button if any of the
      // pfb export operations are running.
      return !(this.state.exportingToTerra
        || this.state.exportingToSevenBridges
        || this.isPFBRunning());
    }
    if (buttonConfig.type === 'export-to-seven-bridges') {
      if (!this.props.buttonConfig.sevenBridgesExportURL) {
        console.error('Export to Terra button is present, but there is no `terraExportURL` specified in the portal config. Disabling the export to Terra button.'); // eslint-disable-line no-console
        return false;
      }
      // disable the seven bridges export buttons if any of the
      // pfb export operations are running.
      return !(this.state.exportingToTerra
        || this.state.exportingToSevenBridges
        || this.isPFBRunning());
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
    if (buttonConfig.type === 'export-to-workspace' || buttonConfig.type === 'export-files-to-workspace') {
      return this.state.exportingToWorkspace;
    }
    if (buttonConfig.type === 'export-to-pfb') {
      // export to pfb button is pending if a pfb export job is running and it's
      // neither an export to terra job or an export to seven bridges job.
      return this.isPFBRunning()
        && !(this.state.exportingToTerra || this.state.exportingToSevenBridges);
    }
    if (buttonConfig.type === 'export') {
      // export to terra button is pending if a pfb export job is running and
      // it's an exporting to terra job.
      return this.isPFBRunning()
        && this.state.exportingToTerra;
    }
    if (buttonConfig.type === 'export-to-seven-bridges') {
      // export to seven bridges button is pending if a pfb export job is running
      // and it's an export to seven bridges job.
      return this.isPFBRunning()
        && this.state.exportingToSevenBridges;
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
          // REMOVE THIS CODE WHEN EXPORT TO TERRA WORKS
          // ===========================================
          this.state.enableTerraWarningPopup &&
            (<Popup
              message={terraExportWarning.message
                ? terraExportWarning.message
                : `Warning: You have selected more subjects than are currently supported. The import may not succeed. Terra recommends slicing your data into segments of no more than ${terraExportWarning.subjectThreshold.toLocaleString()} subjects and exporting each separately. Would you like to continue anyway?`
              }
              title={terraExportWarning.title
                ? terraExportWarning.title
                : 'Warning: Export May Fail'
              }
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
            />)
          // ===========================================
        }
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
  dataTypeToRootNodeMapping: PropTypes.objectOf(PropTypes.string),
};

ExplorerButtonGroup.defaultProps = {
  job: null,
  isPending: false,
  // FIXME DEVELOPMENT ONLY
  dataTypeToRootNodeMapping: {
    'Aligned Reads': 'submitted_aligned_reads',
    'Simple Germline Variation': 'simple_germline_variation',
    'Unharmonized Clinical Data': 'reference_file',
    'Variant Calls': 'reference_file',
    'Other': 'reference_file',
    'Script': 'reference_file',
  }
  // END FIXME
};

export default ExplorerButtonGroup;
