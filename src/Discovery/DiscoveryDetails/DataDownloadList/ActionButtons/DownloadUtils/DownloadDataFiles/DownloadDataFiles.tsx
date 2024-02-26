import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { fetchWithCreds } from '../../../../../../actions';
import { jobAPIPath } from '../../../../../../localconf';
import DownloadStatus from '../../../Interfaces/DownloadStatus';
import CheckFederatedLoginStatus from './CheckFederatedLoginStatus';
import CheckDownloadStatus from './CheckDownloadStatus';
import { DOWNLOAD_FAIL_STATUS, JOB_POLLING_INTERVAL } from './Constants';

const DownloadDataFiles = async (
  downloadStatus: DownloadStatus,
  setDownloadStatus: (arg0: DownloadStatus) => void,
  history: RouteComponentProps['history'],
  location: RouteComponentProps['location'],
  healLoginNeeded: string[],
  verifyExternalLoginsNeeded: boolean | undefined,
  fileManifest: any[],
) => {
  if (verifyExternalLoginsNeeded) {
    const isLinked = await CheckFederatedLoginStatus(
      setDownloadStatus,
      fileManifest,
      history,
      location,
    );
    if (!isLinked) {
      return;
    }
  }
  if (healLoginNeeded.length) {
    return;
  }
  fetchWithCreds({
    path: `${jobAPIPath}dispatch`,
    method: 'POST',
    body: JSON.stringify({
      action: 'batch-export',
      input: { file_manifest: fileManifest || [] },
    }),
  })
    .then((dispatchResponse) => {
      const { uid } = dispatchResponse.data;
      if (dispatchResponse.status === 403 || dispatchResponse.status === 302) {
        setDownloadStatus({
          inProgress: '',
          message: {
            title: 'Download failed',
            content: (
              <p>
                Unable to authorize download. Please refresh the page and ensure
                you are logged in.
              </p>
            ),
            active: true,
          },
        });
      } else if (dispatchResponse.status !== 200 || !uid) {
        setDownloadStatus(DOWNLOAD_FAIL_STATUS);
      } else {
        setDownloadStatus({
          inProgress: 'DownloadDataFiles',
          message: {
            title: 'Your download is being prepared',
            content: (
              <p>
                Please remain on this page until your download completes. When
                your download is ready, it will begin automatically. You can
                close this window.
              </p>
            ),
            active: true,
          },
        });
        setTimeout(
          CheckDownloadStatus,
          JOB_POLLING_INTERVAL,
          uid,
          downloadStatus,
          setDownloadStatus,
        );
      }
    })
    .catch(() => setDownloadStatus(DOWNLOAD_FAIL_STATUS));
};

export default DownloadDataFiles;
