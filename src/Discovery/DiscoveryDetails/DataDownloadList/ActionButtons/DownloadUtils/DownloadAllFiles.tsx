import React from 'react';
import { fetchWithCreds } from '../../../../../actions';
import { jobAPIPath } from '../../../../../localconf';
import DownloadStatus from '../../Interfaces/DownloadStatus';

const JOB_POLLING_INTERVAL = 5000;
const DOWNLOAD_SUCCEEDED_MESSAGE = 'Your download has been prepared. If your download doesn\'t start automatically, please follow this direct link:';

const DOWNLOAD_FAIL_STATUS: DownloadStatus = {
  inProgress: false,
  message: {
    title: 'Download failed',
    content: (
      <p>
        There was a problem preparing your download. Please consider using the
        Gen3 SDK for Python (w/ CLI) to download these files via a manifest.
      </p>
    ),
    active: true,
  },
};

const checkDownloadStatus = (
  uid: string,
  downloadStatus: DownloadStatus,
  setDownloadStatus: (arg0: DownloadStatus) => void,
) => {
  fetchWithCreds({ path: `${jobAPIPath}status?UID=${uid}` }).then(
    (statusResponse) => {
      const { status } = statusResponse.data;
      if (statusResponse.status !== 200 || !status) {
        // usually empty status message means Sower can't find a job by its UID
        setDownloadStatus(DOWNLOAD_FAIL_STATUS);
      } else if (status === 'Failed') {
        fetchWithCreds({ path: `${jobAPIPath}output?UID=${uid}` })
          .then((outputResponse) => {
            const { output } = outputResponse.data;
            if (outputResponse.status !== 200 || !output) {
              setDownloadStatus(DOWNLOAD_FAIL_STATUS);
            } else {
              setDownloadStatus({
                inProgress: false,
                message: {
                  title: 'Download failed',
                  content: <p>{ output }</p>,
                  active: true,
                },
              });
            }
          })
          .catch(() => setDownloadStatus(DOWNLOAD_FAIL_STATUS));
      } else if (status === 'Completed') {
        fetchWithCreds({ path: `${jobAPIPath}output?UID=${uid}` })
          .then((outputResponse) => {
            const { output } = outputResponse.data;
            if (outputResponse.status !== 200 || !output) {
              setDownloadStatus(DOWNLOAD_FAIL_STATUS);
            } else {
              try {
                const regexp = /^https?:\/\/(\S+)\.s3\.amazonaws\.com\/(\S+)/gm;
                if (!new RegExp(regexp).test(output)) {
                  throw new Error('Invalid download URL');
                }
                setDownloadStatus({
                  inProgress: false,
                  message: {
                    title: 'Your download is ready',
                    content: (
                      <React.Fragment>
                        <p> {DOWNLOAD_SUCCEEDED_MESSAGE} </p>
                        <a href={output} target='_blank' rel='noreferrer'>
                          {output}
                        </a>
                      </React.Fragment>
                    ),
                    active: true,
                  },
                });
                setTimeout(() => window.open(output), 2000);
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
          })
          .catch(() => setDownloadStatus(DOWNLOAD_FAIL_STATUS));
      } else {
        setTimeout(
          checkDownloadStatus,
          JOB_POLLING_INTERVAL,
          uid,
          downloadStatus,
          setDownloadStatus,
        );
      }
    },
  );
};

const DownloadAllFiles = (
  studyIDs: any[],
  downloadStatus: DownloadStatus,
  setDownloadStatus: (arg0: DownloadStatus) => void,
) => {
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
          inProgress: false,
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
          inProgress: true,
          message: {
            title: 'Your download is being prepared',
            content: (
              <p>
                Please remain on this page until your download completes. When your download is ready,
                it will begin automatically. You can close this window.
              </p>
            ),
            active: true,
          },
        });
        setTimeout(
          checkDownloadStatus,
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
