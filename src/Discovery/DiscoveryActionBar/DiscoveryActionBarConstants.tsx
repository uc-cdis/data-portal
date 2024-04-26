import React from 'react';

const BATCH_EXPORT_JOB_PREFIX = 'batch-export';
const GUID_PREFIX_PATTERN = /^dg.[a-zA-Z0-9]+\//;
const DOWNLOAD_SUCCEEDED_MESSAGE = 'Your download has been prepared. If your download doesn\'t start automatically, please follow this direct link:';
const JOB_POLLING_INTERVAL = 5000;

const DOWNLOAD_FAIL_STATUS = {
  inProgress: false,
  message: {
    title: 'Download failed',
    content: (
      <p>
        {' '}
        There was a problem preparing your download. Please consider using the
        Gen3 SDK for Python (w/ CLI) to download these files via a manifest.
      </p>
    ),
    active: true,
  },
};

export {
  BATCH_EXPORT_JOB_PREFIX, GUID_PREFIX_PATTERN, JOB_POLLING_INTERVAL, DOWNLOAD_SUCCEEDED_MESSAGE, DOWNLOAD_FAIL_STATUS,
};
