import React from 'react';
import DownloadStatus from '../../Interfaces/DownloadStatus';

export const INITIAL_DOWNLOAD_STATUS: DownloadStatus = {
  inProgress: '',
  message: { title: '', content: <React.Fragment />, active: false },
};

export const DOWNLOAD_FAIL_STATUS: DownloadStatus = {
  inProgress: '',
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

export const JOB_POLLING_INTERVAL = 5000;
