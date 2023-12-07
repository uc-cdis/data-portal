import React from 'react';
import { fetchWithCreds } from '../../../../../../actions';
import { jobAPIPath } from '../../../../../../localconf';
import DownloadStatus from '../../../Interfaces/DownloadStatus';
import {
  DOWNLOAD_FAIL_STATUS,
  DOWNLOAD_SUCCEEDED_MESSAGE,
  JOB_POLLING_INTERVAL,
} from './Constants';

const CheckDownloadStatus = (
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
                  content: <p>{output}</p>,
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
          CheckDownloadStatus,
          JOB_POLLING_INTERVAL,
          uid,
          downloadStatus,
          setDownloadStatus,
        );
      }
    },
  );
};

export default CheckDownloadStatus;
