import React from 'react';
import DownloadStatus from '../../Interfaces/DownloadStatus';

export const INITIAL_DOWNLOAD_STATUS: DownloadStatus = {
  inProgress: false,
  message: { title: '', content: <React.Fragment />, active: false },
};

export const DOWNLOAD_FAIL_STATUS: DownloadStatus = {
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

export const DOWNLOAD_SUCCEEDED_MESSAGE =
  "Your download has been prepared. If your download doesn't start automatically, please follow this direct link:";

export const JOB_POLLING_INTERVAL = 5000;
