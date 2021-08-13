import React from 'react';
import {
  Space,
  Popover,
  Button,
  Modal,
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
import { manifestServiceApiPath, hostname, jobAPIPath } from '../localconf';

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
    active: boolean,
    url: string
  },
  setDownloadStatusMessage: (Object) => void;
}

const handleDownloadZipClick = async (
  selectedResources: any[],
  setDownloadInProgress: (boolean) => void,
  setDownloadStatusMessage: (object) => void,
) => {
  const studyIDs = selectedResources.map((study) => study.project_number);
  setDownloadInProgress(true);
  setDownloadStatusMessage({
    title: 'Your download is being prepared',
    message: 'Please remain on this page while your download is being prepared.\n\n'
               + 'When your download is ready, it will begin automatically. You can close this window.',
    active: true,
    url: '',
  });

  const handleJobError = () => {
    setDownloadInProgress(false);
    setDownloadStatusMessage({
      title: 'Download failed',
      message: 'There was a problem preparing your download.'
                + 'Please consider using the gen3 client to download these files via a manifest.',
      active: true,
      url: '',
    });
  };

  fetchWithCreds({
    path: `${jobAPIPath}dispatch`,
    method: 'POST',
    body: JSON.stringify({
      action: 'batch-export',
      input: {
        study_ids: studyIDs,
      },
    }),
  }).then(
    (dispatchResponse) => {
      const { uid } = dispatchResponse.data;
      const pollForJobStatusUpdate = () => {
        fetchWithCreds({ path: `${jobAPIPath}status?UID=${uid}` }).then(
          (statusResponse) => {
            const { status } = statusResponse.data;
            if (status === 'Failed') {
              fetchWithCreds({ path: `${jobAPIPath}output?UID=${uid}` }).then(
                (outputResponse) => {
                  setDownloadStatusMessage({
                    title: 'Download failed',
                    message: outputResponse.data.output,
                    active: true,
                    url: '',
                  });
                  setDownloadInProgress(false);
                },
              ).catch(handleJobError);
            } else if (status === 'Completed') {
              fetchWithCreds({ path: `${jobAPIPath}output?UID=${uid}` }).then(
                (outputResponse) => {
                  const { output } = outputResponse.data;
                  setDownloadStatusMessage({
                    title: 'Your download is ready',
                    message: 'Your download has been prepared. If your download doesn\'t start automatically, please follow this direct link:',
                    active: true,
                    url: output,
                  });
                  setDownloadInProgress(false);
                  setTimeout(() => window.open(output), 2000);
                },
              ).catch(handleJobError);
            } else {
              setTimeout(pollForJobStatusUpdate, 5000);
            }
          },
        );
      };
      setTimeout(pollForJobStatusUpdate, 5000);
    },
  ).catch(handleJobError);
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
                      );
                    } else {
                      handleRedirectToLoginClick();
                    }
                  }}
                  type='text'
                  disabled={props.selectedResources.length === 0 || props.downloadInProgress === true}
                  icon={<DownloadOutlined />}
                  loading={props.downloadInProgress}
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
            <Modal
              closable={false}
              visible={props.downloadStatusMessage.active}
              title={props.downloadStatusMessage.title}
              footer={(
                <Button
                  onClick={
                    () => props.setDownloadStatusMessage({
                      title: '', message: '', active: false, url: '',
                    })
                  }
                >
                  Close
                </Button>
              )}
            >
              { props.downloadStatusMessage.message }
              {
                props.downloadStatusMessage.url
                  && <a href={props.downloadStatusMessage.url}>{props.downloadStatusMessage.url}</a>
              }
            </Modal>
          </Space>
        )}
    </div>
  );
};

export default DiscoveryActionBar;
