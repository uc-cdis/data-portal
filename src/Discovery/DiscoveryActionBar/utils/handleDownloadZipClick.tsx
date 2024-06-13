import React from 'react';
import { DiscoveryConfig } from '../../DiscoveryConfig';
import { DownloadStatus } from '../DiscoveryActionBarInterfaces';
import checkDownloadStatus from './checkDownloadStatus';
import { jobAPIPath } from '../../../localconf';
import {
  JOB_POLLING_INTERVAL,
  DOWNLOAD_FAIL_STATUS,
} from '../DiscoveryActionBarConstants';
import { fetchWithCreds } from '../../../actions';
import checkFederatedLoginStatus from './checkFederatedStatus';
import assembleFileManifest from './assembleFileManifest';

const handleDownloadZipClick = async (
  config: DiscoveryConfig,
  selectedResources: any[],
  downloadStatus: DownloadStatus,
  setDownloadStatus: (arg0: DownloadStatus) => void,
  history,
  location,
  healIDPLoginNeeded,
) => {
  const DOWNLOAD_UNAUTHORIZED_MESSAGE = 'Unable to authorize download. Please refresh the page and ensure you are logged in.';
  const DOWNLOAD_STARTED_MESSAGE = 'Please remain on this page until your download completes. When your download is ready, '
    + 'it will begin automatically. You can close this window.';

  const { manifestFieldName } = config.features.exportToWorkspace;
  if (config.features.exportToWorkspace.verifyExternalLogins) {
    const isLinked = await checkFederatedLoginStatus(
      setDownloadStatus,
      selectedResources,
      manifestFieldName,
      history,
      location,
    );
    if (!isLinked) {
      return;
    }
  }

  if (healIDPLoginNeeded) {
    return;
  }

  const manifest = assembleFileManifest(manifestFieldName, selectedResources);
  fetchWithCreds({
    path: `${jobAPIPath}dispatch`,
    method: 'POST',
    body: JSON.stringify({
      action: 'batch-export',
      input: { file_manifest: manifest },
    }),
  })
    .then((dispatchResponse) => {
      const { uid } = dispatchResponse.data;
      if (dispatchResponse.status === 403 || dispatchResponse.status === 302) {
        setDownloadStatus({
          inProgress: false,
          message: {
            title: 'Download failed',
            content: <p> {DOWNLOAD_UNAUTHORIZED_MESSAGE} </p>,
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
            content: <p> {DOWNLOAD_STARTED_MESSAGE} </p>,
            active: true,
          },
        });
        setTimeout(
          checkDownloadStatus,
          JOB_POLLING_INTERVAL,
          uid,
          downloadStatus,
          setDownloadStatus,
          selectedResources,
        );
      }
    })
    .catch(() => setDownloadStatus(DOWNLOAD_FAIL_STATUS));
};

export default handleDownloadZipClick;
