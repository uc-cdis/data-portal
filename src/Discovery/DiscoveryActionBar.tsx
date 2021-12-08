import React, { useState, useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';
import {
  Space,
  Popover,
  Button,
  Modal,
  Table,
} from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import {
  LeftOutlined,
  RightOutlined,
  ExportOutlined,
  DownloadOutlined,
  FileTextOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import FileSaver from 'file-saver';
import { DiscoveryConfig } from './DiscoveryConfig';
import { fetchWithCreds } from '../actions';
import {
  manifestServiceApiPath, hostname, jobAPIPath, externalLoginOptionsUrl,
} from '../localconf';

interface User {
  username: string
}
interface JobStatus {
  uid: string;
  status: 'Running' | 'Completed' | 'Failed' | 'Unknown';
  name: string;
}
interface DownloadStatus {
  inProgress: boolean;
  message: {
    content: JSX.Element;
    active: boolean;
    title: string;
  }
}
interface Props {
  config: DiscoveryConfig;
  exportingToWorkspace: boolean;
  setExportingToWorkspace: (boolean) => void;
  filtersVisible: boolean;
  setFiltersVisible: (boolean) => void;
  user: User,
  discovery: {
    actionToResume: 'download'|'export'|'manifest';
    selectedResources: any[];
  };
  onActionResumed: () => any
}

const BATCH_EXPORT_JOB_PREFIX = 'batch-export';
const GUID_PREFIX_PATTERN = /^dg.[a-zA-Z0-9]+\//;
const DOWNLOAD_UNAUTHORIZED_MESSAGE = 'Unable to authorize download. Please refresh the page and ensure you are logged in.';
const DOWNLOAD_STARTED_MESSAGE = 'Please remain on this page until your download completes. When your download is ready, '
+ 'it will begin automatically. You can close this window.';
const DOWNLOAD_SUCCEEDED_MESSAGE = 'Your download has been prepared. If your download doesn\'t start automatically, please follow this direct link:';
const JOB_POLLING_INTERVAL = 5000;

const DOWNLOAD_FAIL_STATUS = {
  inProgress: false,
  message: {
    title: 'Download failed',
    content: (
      <p> There was a problem preparing your download.
        Please consider using the Gen3 SDK for Python (w/ CLI) to download these files via a manifest.
      </p>
    ),
    active: true,
  },
};

const checkFederatedLoginStatus = async (
  setDownloadStatus: (arg0: DownloadStatus) => void,
  selectedResources: any[],
  manifestFieldName: string,
  history,
  location,
) => fetchWithCreds({
  path: `${externalLoginOptionsUrl}`,
  method: 'GET',
}).then(
  async ({ data, status }) => {
    if (status !== 200) {
      return false;
    }
    const { providers } = data;
    const unauthenticatedProviders = providers.filter((provider) => !provider.refresh_token_expiration);

    const guidsForHostnameResolution = [];
    const guidPrefixes = [];
    selectedResources.forEach(
      (selectedResource) => {
        (selectedResource[manifestFieldName] || []).forEach(
          (fileMetadata) => {
            if (fileMetadata.object_id) {
              const guidDomainPrefix = (fileMetadata.object_id.match(GUID_PREFIX_PATTERN) || []).shift();
              if (guidDomainPrefix) {
                if (!guidPrefixes.includes(guidDomainPrefix)) {
                  guidPrefixes.push(guidDomainPrefix);
                  guidsForHostnameResolution.push(fileMetadata.object_id);
                }
              } else {
                guidsForHostnameResolution.push(fileMetadata.object_id);
              }
            }
          });
      },
    );
    const guidResolutions = await Promise.all(
      guidsForHostnameResolution.map(
        (guid) => fetch(`https://dataguids.org/index/${guid}`).then((r) => r.json()).catch(() => {}),
      ),
    );
    const externalHosts = guidResolutions.filter(
      (resolvedGuid) => resolvedGuid && resolvedGuid.from_index_service,
    ).map(
      (resolvedGuid) => new URL(resolvedGuid.from_index_service.host).host,
    );
    const providersToAuthenticate = unauthenticatedProviders.filter(
      (unauthenticatedProvider) => externalHosts.includes(new URL(unauthenticatedProvider.base_url).hostname),
    );
    if (providersToAuthenticate.length) {
      setDownloadStatus({
        inProgress: false,
        message: {
          title: 'Authorization Required',
          active: true,
          content: (
            <React.Fragment>
              <p>The data you have selected requires authorization with the following data resources:</p>
              <Table
                dataSource={providersToAuthenticate}
                columns={[{ title: 'Name', dataIndex: 'name', key: 'name' }, { title: 'IDP', dataIndex: 'idp', key: 'idp' }]}
                size={'small'}
                pagination={false}
              />
              <p>Please authorize these resources at the top of the
                <Button
                  size={'small'}
                  type='link'
                  icon={<LinkOutlined />}
                  onClick={() => history.push('/identity', { from: `${location.pathname}` })}
                >
                  profile page
                </Button>
              </p>
            </React.Fragment>
          ),
        },
      },
      );
      return false;
    }
    return true;
  },
).catch(() => false);

const checkDownloadStatus = (
  uid: string,
  downloadStatus: DownloadStatus,
  setDownloadStatus: (arg0: DownloadStatus) => void,
  selectedResources: any[],
) => {
  fetchWithCreds({ path: `${jobAPIPath}status?UID=${uid}` }).then(
    (statusResponse) => {
      const { status } = statusResponse.data;
      if (statusResponse.status !== 200 || !status) {
        // usually empty status message means Sower can't find a job by its UID
        setDownloadStatus(DOWNLOAD_FAIL_STATUS);
      } else if (status === 'Failed') {
        fetchWithCreds({ path: `${jobAPIPath}output?UID=${uid}` }).then(
          (outputResponse) => {
            const { output } = outputResponse.data;
            if (outputResponse.status !== 200 || !output) {
              setDownloadStatus(DOWNLOAD_FAIL_STATUS);
            } else {
              setDownloadStatus({
                inProgress: false,
                message: {
                  title: 'Download failed',
                  content: <p>{output}</p>,
                  active: true,
                },
              });
            }
          },
        ).catch(() => setDownloadStatus(DOWNLOAD_FAIL_STATUS));
      } else if (status === 'Completed') {
        fetchWithCreds({ path: `${jobAPIPath}output?UID=${uid}` }).then(
          (outputResponse) => {
            const { output } = outputResponse.data;
            if (outputResponse.status !== 200 || !output) {
              setDownloadStatus(DOWNLOAD_FAIL_STATUS);
            } else {
              try {
                /* eslint-disable no-new */
                new URL(output);
                setDownloadStatus({
                  inProgress: false,
                  message: {
                    title: 'Your download is ready',
                    content: (
                      <React.Fragment>
                        <p> { DOWNLOAD_SUCCEEDED_MESSAGE } </p>
                        <a href={output} target='_blank' rel='noreferrer'>{output}</a>
                      </React.Fragment>
                    ),
                    active: true,
                  },
                });
                setTimeout(() => window.open(output), 2000);
                const projectNumber = selectedResources.map((study) => study.project_number);
                const studyName = selectedResources.map((study) => study.study_name);
                datadogRum.addAction('datasetDownload', {
                  datasetDownloadProjectNumber: projectNumber,
                  datasetDownloadStudyName: studyName,
                });
              } catch {
                // job output is not a url -> is an error message
                setDownloadStatus({
                  inProgress: false,
                  message: {
                    title: 'Download failed',
                    content: <p>{output}</p>,
                    active: true,
                  },
                });
              }
            }
          },
        ).catch(() => setDownloadStatus(DOWNLOAD_FAIL_STATUS));
      } else {
        setTimeout(checkDownloadStatus, JOB_POLLING_INTERVAL, uid, downloadStatus, setDownloadStatus, selectedResources);
      }
    },
  );
};

const handleDownloadZipClick = async (
  config: DiscoveryConfig,
  selectedResources: any[],
  downloadStatus: DownloadStatus,
  setDownloadStatus: (arg0: DownloadStatus) => void,
  history,
  location,
) => {
  if (config.features.exportToWorkspace.verifyExternalLogins) {
    const { manifestFieldName } = config.features.exportToWorkspace;
    const isLinked = await checkFederatedLoginStatus(setDownloadStatus, selectedResources, manifestFieldName, history, location);
    if (!isLinked) {
      return;
    }
  }

  const studyIDs = selectedResources.map((study) => study.project_number);
  fetchWithCreds({
    path: `${jobAPIPath}dispatch`,
    method: 'POST',
    body: JSON.stringify({ action: 'batch-export', input: { study_ids: studyIDs } }),
  }).then(
    (dispatchResponse) => {
      const { uid } = dispatchResponse.data;
      if (dispatchResponse.status === 403 || dispatchResponse.status === 302) {
        setDownloadStatus({
          inProgress: false,
          message: {
            title: 'Download failed',
            content: <p> { DOWNLOAD_UNAUTHORIZED_MESSAGE } </p>,
            active: true,
          },
        });
      } else if (dispatchResponse.status !== 200 || !uid) {
        setDownloadStatus(DOWNLOAD_FAIL_STATUS);
      } else {
        setDownloadStatus({
          inProgress: true,
          message: {
            title: 'Your download is being prepared',
            content: <p> { DOWNLOAD_STARTED_MESSAGE } </p>,
            active: true,
          },
        });
        setTimeout(checkDownloadStatus, JOB_POLLING_INTERVAL, uid, downloadStatus, setDownloadStatus, selectedResources);
      }
    },
  ).catch(() => setDownloadStatus(DOWNLOAD_FAIL_STATUS));
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
  const projectNumber = selectedResources.map((study) => study.project_number);
  const studyName = selectedResources.map((study) => study.study_name);
  datadogRum.addAction('manifestDownload', {
    manifestDownloadProjectNumber: projectNumber,
    manifestDownloadStudyName: studyName,
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
  setDownloadStatus: (arg0: DownloadStatus) => void,
  history: any,
  location: any,
) => {
  const { manifestFieldName } = config.features.exportToWorkspace;
  if (!manifestFieldName) {
    throw new Error('Missing required configuration field `config.features.exportToWorkspace.manifestFieldName`');
  }

  if (config.features.exportToWorkspace.verifyExternalLogins) {
    const isLinked = await checkFederatedLoginStatus(
      setDownloadStatus, selectedResources, manifestFieldName, history, location,
    );
    if (!isLinked) {
      return;
    }
  }

  setExportingToWorkspace(true);
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
  const [downloadStatus, setDownloadStatus] = useState({
    inProgress: false,
    message: { title: '', content: <React.Fragment />, active: false },
  });

  // begin monitoring download job when component mounts if one already exists and is running
  useEffect(
    () => {
      fetchWithCreds({ path: `${jobAPIPath}list` }).then(
        (jobsListResponse) => {
          const { status } = jobsListResponse;
          // jobsListResponse will be boilerplate HTML when not logged in
          if (status === 200 && typeof jobsListResponse.data === 'object') {
            const runningJobs: JobStatus[] = jobsListResponse.data;
            runningJobs.forEach(
              (job) => {
                if (job.status === 'Running' && job.name.startsWith(BATCH_EXPORT_JOB_PREFIX)) {
                  setDownloadStatus({ ...downloadStatus, inProgress: true });
                  setTimeout(
                    checkDownloadStatus, JOB_POLLING_INTERVAL, job.uid, downloadStatus, setDownloadStatus, props.discovery.selectedResources,
                  );
                }
              },
            );
          }
        },
      );
    },
    [],
  );

  useEffect(
    () => {
      if (props.discovery.actionToResume === 'download') {
        handleDownloadZipClick(
          props.config,
          props.discovery.selectedResources,
          downloadStatus,
          setDownloadStatus,
          history,
          location,
        );
        props.onActionResumed();
      } else if (props.discovery.actionToResume === 'export') {
        handleExportToWorkspaceClick(
          props.config,
          props.discovery.selectedResources,
          props.setExportingToWorkspace,
          setDownloadStatus,
          history,
          location,
        );
        props.onActionResumed();
      } else if (props.discovery.actionToResume === 'manifest') {
        handleDownloadManifestClick(props.config, props.discovery.selectedResources);
        props.onActionResumed();
      }
    }, [props.discovery.actionToResume],
  );

  const handleRedirectToLoginClick = (action:'download'|'export'|'manifest' = null) => {
    const serializableState = {
      ...props.discovery,
      actionToResume: action,
      // reduce the size of the redirect url by only storing resource id
      // resource id is remapped to its resource after redirect and resources load in index component
      selectedResourceIDs: props.discovery.selectedResources.map(
        (resource) => resource[props.config.minimalFieldMapping.uid],
      ),
    };
    delete serializableState.selectedResources;
    const queryStr = `?state=${encodeURIComponent(JSON.stringify(serializableState))}`;
    history.push('/login', { from: `${location.pathname}${queryStr}` });
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
            <span className='discovery-export__selected-ct'>{props.discovery.selectedResources.length} selected</span>
            {
              props.config.features.exportToWorkspace.enableDownloadZip
              && (
                <Button
                  onClick={
                    async () => {
                      if (props.user.username) {
                        handleDownloadZipClick(
                          props.config,
                          props.discovery.selectedResources,
                          downloadStatus,
                          setDownloadStatus,
                          history,
                          location,
                        );
                      } else {
                        handleRedirectToLoginClick('download');
                      }
                    }
                  }
                  type='text'
                  disabled={props.discovery.selectedResources.length === 0 || downloadStatus.inProgress}
                  icon={<DownloadOutlined />}
                  loading={downloadStatus.inProgress}
                >
                  {(
                    () => {
                      if (props.user.username) {
                        if (downloadStatus.inProgress) {
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
                    handleDownloadManifestClick(props.config, props.discovery.selectedResources);
                  }
                    : () => { handleRedirectToLoginClick('manifest'); }}
                  type='text'
                  disabled={props.discovery.selectedResources.length === 0}
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
                className={`discovery-action-bar-button${(props.discovery.selectedResources.length === 0) ? '--disabled' : ''}`}
                disabled={props.discovery.selectedResources.length === 0}
                loading={props.exportingToWorkspace}
                icon={<ExportOutlined />}
                onClick={(props.user.username) ? async () => {
                  handleExportToWorkspaceClick(
                    props.config,
                    props.discovery.selectedResources,
                    props.setExportingToWorkspace,
                    setDownloadStatus,
                    history,
                    location,
                  );
                }
                  : () => { handleRedirectToLoginClick('export'); }}
              >
                {(props.user.username) ? 'Open In Workspace' : 'Login to Open In Workspace'}
              </Button>
            </Popover>
            <Modal
              closable={false}
              visible={downloadStatus.message.active}
              title={downloadStatus.message.title}
              footer={(
                <Button
                  onClick={
                    () => setDownloadStatus({
                      ...downloadStatus,
                      message: {
                        title: '',
                        content: <React.Fragment />,
                        active: false,
                      },
                    })
                  }
                >
                  Close
                </Button>
              )}
            >
              { downloadStatus.message.content }
            </Modal>
          </Space>
        )}
    </div>
  );
};

export default DiscoveryActionBar;
