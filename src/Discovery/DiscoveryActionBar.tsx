import React from 'react';
import { datadogRum } from '@datadog/browser-rum';
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
import {
  manifestServiceApiPath, hostname, jobAPIPath, externalLoginOptionsUrl,
  appname,
} from '../localconf';

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
  discoveryActionStatusMessage: {
    title: string,
    message: string,
    active: boolean,
    url: string
  },
  setDiscoveryActionStatusMessage: (Object) => void;
}

const checkFederatedLoginStatus = async (
  setDiscoveryActionStatusMessage: (arg0: Object) => void,
) => fetchWithCreds({
  path: `${externalLoginOptionsUrl}`,
  method: 'GET',
}).then(
  ({ data, status }) => {
    if (status !== 200) {
      return false;
    }

    const { providers } = data;
    const unauthenticatedProviders = providers.filter(
      (provider) => !provider.refresh_token_expiration,
    );
    if (unauthenticatedProviders.length) {
      setDiscoveryActionStatusMessage({
        title: 'Please link your account to external repositories first.',
        message: `The ${appname} connects to data from multiple sources. `
                    + 'To ensure full data accessibility, please authorize all external resources by navigating to the workspace link '
                    + 'below and logging in to the available data resources at the bottom of the page. ',
        active: true,
        url: `${hostname}workspace`,
      });
      return false;
    }
    return true;
  },
).catch(() => false);

const handleDownloadZipClick = async (
  config: DiscoveryConfig,
  selectedResources: any[],
  setDownloadInProgress: (arg0: boolean) => void,
  setDiscoveryActionStatusMessage: (arg0: Object) => void,
) => {
  if (config.features.exportToWorkspace.verifyExternalLogins) {
    const isLinked = await checkFederatedLoginStatus(
      setDiscoveryActionStatusMessage,
    );
    if (!isLinked) {
      return;
    }
  }

  const studyIDs = selectedResources.map((study) => study.project_number);
  const ddActionData = selectedResources.map((study) => ({
    projectNumber: study.project_number,
    studyName: study.study_name,
  }));
  setDownloadInProgress(true);
  setDiscoveryActionStatusMessage({
    title: 'Your download is being prepared',
    message: 'Please remain on this page while your download is being prepared.\n\n'
               + 'When your download is ready, it will begin automatically. You can close this window.',
    active: true,
    url: '',
  });

  const handleJobError = () => {
    setDownloadInProgress(false);
    setDiscoveryActionStatusMessage({
      title: 'Download failed',
      message: 'There was a problem preparing your download. '
                + 'Please consider using the Gen3 SDK for Python (w/ CLI) to download these files via a manifest.',
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
      if (dispatchResponse.status === 403 || dispatchResponse.status === 302) {
        setDownloadInProgress(false);
        setDiscoveryActionStatusMessage({
          title: 'Download failed',
          message: 'Unable to authorize download. '
                  + 'Please refresh the page and ensure you are logged in.',
          active: true,
          url: '',
        });
      } else if (dispatchResponse.status !== 200 || !uid) {
        handleJobError();
      } else {
        const pollForJobStatusUpdate = () => {
          fetchWithCreds({ path: `${jobAPIPath}status?UID=${uid}` }).then(
            (statusResponse) => {
              const { status } = statusResponse.data;
              if (statusResponse.status !== 200 || !status) {
                // usually empty status message means Sower can't find a job by its UID
                handleJobError();
              } else if (status === 'Failed') {
                fetchWithCreds({ path: `${jobAPIPath}output?UID=${uid}` }).then(
                  (outputResponse) => {
                    const { output } = outputResponse.data;
                    if (outputResponse.status !== 200 || !output) {
                      handleJobError();
                    } else {
                      setDiscoveryActionStatusMessage({
                        title: 'Download failed',
                        message: output,
                        active: true,
                        url: '',
                      });
                      setDownloadInProgress(false);
                    }
                  },
                ).catch(handleJobError);
              } else if (status === 'Completed') {
                fetchWithCreds({ path: `${jobAPIPath}output?UID=${uid}` }).then(
                  (outputResponse) => {
                    const { output } = outputResponse.data;
                    if (outputResponse.status !== 200 || !output) {
                      handleJobError();
                    } else {
                      setDiscoveryActionStatusMessage({
                        title: 'Your download is ready',
                        message: 'Your download has been prepared. If your download doesn\'t start automatically, please follow this direct link: ',
                        active: true,
                        url: output,
                      });
                      setDownloadInProgress(false);
                      setTimeout(() => window.open(output), 2000);
                      datadogRum.addAction('datasetDownload', {
                        datasetDownload: ddActionData,
                      });
                    }
                  },
                ).catch(handleJobError);
              } else {
                setTimeout(pollForJobStatusUpdate, 5000);
              }
            },
          );
        };
        setTimeout(pollForJobStatusUpdate, 5000);
      }
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
  const ddActionData = selectedResources.map((study) => ({
    projectNumber: study.project_number,
    studyName: study.study_name,
  }));
  datadogRum.addAction('manifestDownload', {
    manifestDownload: ddActionData,
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
  setDiscoveryActionStatusMessage: (arg0: Object) => void,
  history: any,
) => {
  if (config.features.exportToWorkspace.verifyExternalLogins) {
    const isLinked = await checkFederatedLoginStatus(
      setDiscoveryActionStatusMessage,
    );
    if (!isLinked) {
      return;
    }
  }

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
                  onClick={
                    async () => {
                      if (props.user.username) {
                        handleDownloadZipClick(
                          props.config,
                          props.selectedResources,
                          props.setDownloadInProgress,
                          props.setDiscoveryActionStatusMessage,
                        );
                      } else {
                        handleRedirectToLoginClick();
                      }
                    }
                  }
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
                onClick={(props.user.username) ? async () => {
                  handleExportToWorkspaceClick(
                    props.config,
                    props.selectedResources,
                    props.setExportingToWorkspace,
                    props.setDiscoveryActionStatusMessage,
                    history,
                  );
                }
                  : () => { handleRedirectToLoginClick(); }}
              >
                {(props.user.username) ? 'Open In Workspace' : 'Login to Open In Workspace'}
              </Button>
            </Popover>
            <Modal
              closable={false}
              visible={props.discoveryActionStatusMessage.active}
              title={props.discoveryActionStatusMessage.title}
              footer={(
                <Button
                  onClick={
                    () => props.setDiscoveryActionStatusMessage({
                      title: '', message: '', active: false, url: '',
                    })
                  }
                >
                  Close
                </Button>
              )}
            >
              { props.discoveryActionStatusMessage.message }
              {
                props.discoveryActionStatusMessage.url
                  && <a href={props.discoveryActionStatusMessage.url} target='_blank' rel='noreferrer'>{props.discoveryActionStatusMessage.url}</a>
              }
            </Modal>
          </Space>
        )}
    </div>
  );
};

export default DiscoveryActionBar;
