import React from 'react';
import {
  Space,
  Popover,
  Button,
} from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import {
  LeftOutlined,
  RightOutlined,
  ExportOutlined,
  DownloadOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import FileSaver from 'file-saver';
import { DiscoveryConfig } from './DiscoveryConfig';
import { fetchWithCreds } from '../actions';
import { manifestServiceApiPath, hostname } from '../localconf';
import Popup from '../components/Popup';

interface User {
  username: string
}
interface Props {
  config: DiscoveryConfig;
  selectedResources: any[];
  exportingToWorkspace: boolean;
  setExportingToWorkspace: (boolean) => void;
  filtersVisible: boolean;
  setFiltersVisible: (boolean) => void;
  user: User,
  downloadInProgress: boolean,
  setDownloadInProgress: (boolean) => void,
  downloadStatusMessage: {
    title: string,
    message: string,
    active: boolean
  },
  setDownloadStatusMessage: (Object) => void;
}

const handleDownloadZipClick = async (
  selectedResources: any[],
  setDownloadInProgress: (boolean) => void,
  setDownloadStatusMessage: (object) => void,
  manifestFieldName: string,
  maxDownloadSizeBytes: number,
) => {
  const studyIDs = selectedResources.map((study) => study.project_number);
  let downloadSize = 0;
  selectedResources.forEach(
    (study) => {
      study[manifestFieldName].forEach(
        (file) => {
          downloadSize += file.file_size;
        },
      );
    },
  );

  if (downloadSize > maxDownloadSizeBytes) {
    const maxSizeMB = (maxDownloadSizeBytes / 1000000).toFixed(1);
    const downloadSizeMb = (downloadSize / 1000000).toFixed(1);
    setDownloadStatusMessage(
      {
        title: 'Download limit exceeded',
        message: `
        The selected studies contain ${downloadSizeMb} MB of data, which exceeds the download limit of ${maxSizeMB} MB.
        Please deselect some studies and try again, or use the gen3 client.
        `,
        active: true,
      },
    );
    return;
  }

  setDownloadInProgress(true);
  setDownloadStatusMessage(
    {
      title: 'Your download is being prepared',
      message: 'Please remain on this page while your download is being prepared.\n\n'
                 + 'When your download is ready, it will begin automatically. You can close this window.',
      active: true,
    },
  );

  const triggerDownloadResponse = await fetch(
    '/job/dispatch',
    {
      method: 'POST',
      body: JSON.stringify({
        action: 'batch-export',
        input: {
          study_ids: studyIDs,
        },
      }),
    },
  );
  const initialialJobState = await triggerDownloadResponse.json();
  const downloadFailedMessage = {
    title: 'Download failed',
    message: 'There was a problem preparing your download.'
               + 'Please consider using the gen3 client to download these files via a manifest.',
    active: true,
  };

  if (initialialJobState === null) {
    console.warn('Sower is not configured for batch-export job.');
    setDownloadInProgress(false);
    setDownloadStatusMessage(downloadFailedMessage);
  } else {
    const { uid } = initialialJobState;
    const pollForUpdate = async () => {
      const statusResponse = await fetch(`/job/status?UID=${uid}`);
      const statusObject = await statusResponse.json();
      const { status } = statusObject;

      if (status === 'Failed') {
        setDownloadStatusMessage(downloadFailedMessage);
        setDownloadInProgress(false);
      } else if (status === 'Completed') {
        const outputResponse = await fetch(`/job/output?UID=${uid}`);
        const outputJSON = await outputResponse.json();
        const url = outputJSON.output;
        const message = `Your download has been prepared. If your download doesn't start automatically, please copy and paste this url into your browser:\n\n${url}`;
        setDownloadStatusMessage(
          {
            title: 'Your download is ready',
            message,
            active: true,
          },
        );
        setDownloadInProgress(false);
        setTimeout(() => window.open(url), 2000);
      } else {
        setTimeout(pollForUpdate, 5000);
      }
    };
    setTimeout(pollForUpdate, 5000);
  }
};

const handleDownloadManifestClick = (config: DiscoveryConfig, selectedResources: any[]) => {
  const { manifestFieldName } = config.features.exportToWorkspace;
  if (!manifestFieldName) {
    throw new Error('Missing required configuration field `config.features.exportToWorkspace.manifestFieldName`');
  }
  // combine manifests from all selected studies
  const manifest = [];
  selectedResources.forEach((study) => {
    if (study[manifestFieldName]) {
      if ('commons_url' in study && !(hostname.includes(study.commons_url))) { // PlanX addition to allow hostname based DRS in manifest download clients
        // like FUSE
        manifest.push(...study[manifestFieldName].map((x) => ({
          ...x,
          commons_url: ('commons_url' in x)
            ? x.commons_url : study.commons_url,
        })));
      } else {
        manifest.push(...study[manifestFieldName]);
      }
    }
  });
  // download the manifest
  const MANIFEST_FILENAME = 'manifest.json';
  const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'text/json' });
  FileSaver.saveAs(blob, MANIFEST_FILENAME);
};

const handleExportToWorkspaceClick = async (
  config: DiscoveryConfig,
  selectedResources: any[],
  setExportingToWorkspace: (boolean) => void,
  history: any,
) => {
  setExportingToWorkspace(true);
  const { manifestFieldName } = config.features.exportToWorkspace;
  if (!manifestFieldName) {
    throw new Error('Missing required configuration field `config.features.exportToWorkspace.manifestFieldName`');
  }
  // combine manifests from all selected studies
  const manifest = [];
  selectedResources.forEach((study) => {
    if (study[manifestFieldName]) {
      if ('commons_url' in study && !(hostname.includes(study.commons_url))) { // PlanX addition to allow hostname based DRS in manifest download clients
        // like FUSE
        manifest.push(...study[manifestFieldName].map((x) => ({
          ...x,
          commons_url: ('commons_url' in x)
            ? x.commons_url : study.commons_url,
        })));
      } else {
        manifest.push(...study[manifestFieldName]);
      }
    }
  });
  // post selected resources to manifestservice
  const res = await fetchWithCreds({
    path: `${manifestServiceApiPath}`,
    body: JSON.stringify(manifest),
    method: 'POST',
  });
  if (res.status !== 200) {
    throw new Error(`Encountered error while exporting to Workspace: ${JSON.stringify(res)}`);
  }
  setExportingToWorkspace(false);
  // redirect to Workspaces page
  history.push('/workspace');
};

const DiscoveryActionBar = (props: Props) => {
  const history = useHistory();
  const location = useLocation();

  const handleRedirectToLoginClick = () => {
    history.push('/login', { from: `${location.pathname}` });
  };

  return (
    <div className='discovery-studies__header'>
      {/* Advanced search show/hide UI */}
      { (props.config.features.advSearchFilters && props.config.features.advSearchFilters.enabled)
        ? (
          <Button
            className='discovery-adv-filter-button'
            onClick={() => props.setFiltersVisible(!props.filtersVisible)}
            type='text'
          >
          ADVANCED SEARCH
            { props.filtersVisible
              ? <LeftOutlined />
              : <RightOutlined />}
          </Button>
        )
        : <div />}

      {/* Export to workspaces button */}
      { (
        props.config.features.exportToWorkspace && props.config.features.exportToWorkspace.enabled
      )
        && (
          <Space>
            <span className='discovery-export__selected-ct'>{props.selectedResources.length} selected</span>
            {
              props.config.features.exportToWorkspace.enableDownloadZip
              && (
                <Button
                  onClick={() => {
                    if (props.user.username) {
                      handleDownloadZipClick(
                        props.selectedResources,
                        props.setDownloadInProgress,
                        props.setDownloadStatusMessage,
                        props.config.features.exportToWorkspace.manifestFieldName,
                        props.config.features.exportToWorkspace.downloadZipMaxSizeBytes || 250000000,
                      );
                    } else {
                      handleRedirectToLoginClick();
                    }
                  }}
                  type='text'
                  disabled={props.selectedResources.length === 0 || props.downloadInProgress === true}
                  icon={<DownloadOutlined />}
                >
                  {(
                    () => {
                      if (props.user.username) {
                        if (props.downloadInProgress === true) {
                          return 'Preparing download...';
                        }

                        return `${props.config.features.exportToWorkspace.downloadZipButtonText || 'Download Zip'}`;
                      }
                      return `Login to ${props.config.features.exportToWorkspace.downloadZipButtonText || 'Download Zip'}`;
                    }
                  )()}
                </Button>
              )
            }
            { props.config.features.exportToWorkspace.enableDownloadManifest
            && (
              <Popover
                className='discovery-popover'
                arrowPointAtCenter
                title={(
                  <React.Fragment>
                Download a Manifest File for use with the&nbsp;
                    <a target='_blank' rel='noreferrer' href='https://gen3.org/resources/user/gen3-client/'>
                      {'Gen3 Client'}
                    </a>.
                  </React.Fragment>
                )}
                content={(
                  <span className='discovery-popover__text'>With the Manifest File, you can use the Gen3 Client
              to download the data from the selected studies to your local computer.
                  </span>
                )}
              >
                <Button
                  onClick={(props.user.username) ? () => {
                    handleDownloadManifestClick(props.config, props.selectedResources);
                  }
                    : () => { handleRedirectToLoginClick(); }}
                  type='text'
                  disabled={props.selectedResources.length === 0}
                  icon={<FileTextOutlined />}
                >
                  {(props.user.username) ? `${props.config.features.exportToWorkspace.downloadManifestButtonText || 'Download Manifest'}`
                    : `Login to ${props.config.features.exportToWorkspace.downloadManifestButtonText || 'Download Manifest'}`}
                </Button>

              </Popover>
            )}
            <Popover
              className='discovery-popover'
              arrowPointAtCenter
              content={(
                <React.Fragment>
              Open selected studies in the&nbsp;
                  <a target='blank' rel='noreferrer' href='https://gen3.org/resources/user/analyze-data/'>
                    {'Gen3 Workspace'}
                  </a>.
                </React.Fragment>
              )}
            >
              <Button
                type='default'
                className={`discovery-action-bar-button${(props.selectedResources.length === 0) ? '--disabled' : ''}`}
                disabled={props.selectedResources.length === 0}
                loading={props.exportingToWorkspace}
                icon={<ExportOutlined />}
                onClick={(props.user.username) ? () => {
                  handleExportToWorkspaceClick(props.config, props.selectedResources, props.setExportingToWorkspace, history);
                }
                  : () => { handleRedirectToLoginClick(); }}
              >
                {(props.user.username) ? 'Open In Workspace' : 'Login to Open In Workspace'}
              </Button>
            </Popover>
            {
              props.downloadStatusMessage.active
            && (
              <Popup
                message={props.downloadStatusMessage.message}
                title={props.downloadStatusMessage.title}
                leftButtons={[
                  {
                    caption: 'Close',
                    fn: () => props.setDownloadStatusMessage({ title: '', message: '', active: false }),
                  },
                ]}
              />
            )
            }

          </Space>
        )}
    </div>
  );
};

export default DiscoveryActionBar;
