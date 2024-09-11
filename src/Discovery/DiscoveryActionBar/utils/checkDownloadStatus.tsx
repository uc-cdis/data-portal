import React from 'react';
import { datadogRum } from '@datadog/browser-rum';
import { faro } from '@grafana/faro-web-sdk';
import {
  JOB_POLLING_INTERVAL, DOWNLOAD_FAIL_STATUS, DOWNLOAD_SUCCEEDED_MESSAGE,
} from '../DiscoveryActionBarConstants';
import { jobAPIPath } from '../../../localconf';
import { DownloadStatus } from '../DiscoveryActionBarInterfaces';
import { fetchWithCreds } from '../../../actions';

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
                const projectNumber = selectedResources.map(
                  (study) => study.project_number,
                );
                const studyName = selectedResources.map(
                  (study) => study.study_name,
                );
                const repositoryName = selectedResources.map(
                  (study) => study.commons,
                );
                datadogRum.addAction('datasetDownload', {
                  datasetDownloadProjectNumber: projectNumber,
                  datasetDownloadStudyName: studyName,
                  datasetDownloadRepositoryName: repositoryName,
                });
                faro.api.pushEvent(
                  'datasetDownload',
                  // Faro only accept string-string pairs in payload
                  {
                    datasetDownloadProjectNumber: projectNumber.join(','),
                    datasetDownloadStudyName: studyName.join(','),
                    datasetDownloadRepositoryName: repositoryName.join(','),
                  },
                );
              } catch {
                // job output is not a url -> then it is an error message
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
          selectedResources,
        );
      }
    },
  );
};

export default checkDownloadStatus;
