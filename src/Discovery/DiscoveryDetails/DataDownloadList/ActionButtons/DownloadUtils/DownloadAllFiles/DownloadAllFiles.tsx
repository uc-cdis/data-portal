import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { fetchWithCreds } from '../../../../../../actions';
import { jobAPIPath } from '../../../../../../localconf';
import DownloadStatus from '../../../Interfaces/DownloadStatus';
import CheckFederatedLoginStatus from './CheckFederatedLoginStatus';
import CheckDownloadStatus from './CheckDownloadStatus';
import { DOWNLOAD_FAIL_STATUS, JOB_POLLING_INTERVAL } from './Constants';

const DownloadAllFiles = async (
  resourceInfo: object,
  downloadStatus: DownloadStatus,
  setDownloadStatus: (arg0: DownloadStatus) => void,
  history: RouteComponentProps['history'],
  location: RouteComponentProps['location'],
  healLoginNeeded: boolean,
  verifyExternalLoginsNeeded: boolean | undefined,
  manifestFieldName: string,
) => {
  if (verifyExternalLoginsNeeded) {
    const isLinked = await CheckFederatedLoginStatus(
      setDownloadStatus,
      resourceInfo,
      manifestFieldName,
      history,
      location,
    );
    if (!isLinked) {
      return;
    }
  }
  if (healLoginNeeded) {
    return;
  }
  const studyIDs = [resourceInfo._hdp_uid];
  fetchWithCreds({
    path: `${jobAPIPath}dispatch`,
    method: 'POST',
    body: JSON.stringify({
      action: 'batch-export',
      input: { study_ids: studyIDs },
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
          inProgress: 'DownloadAllFiles',
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

export default DownloadAllFiles;
