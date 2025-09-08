import React from 'react';

const BATCH_EXPORT_JOB_PREFIX = 'batch-export';
const GUID_PREFIX_PATTERN = /^dg.[a-zA-Z0-9]+\//;
const JOB_POLLING_INTERVAL = 5000;
const DOWNLOAD_FAIL_STATUS = {
  inProgress: false,
  message: {
    title: 'Download failed',
    content: (
      <p>
        {' '}
        There was a problem preparing your download. A common reason 
        for this is that the number of files and/or their sizes are too large. 
        Please download the file manifest and use the Gen3 Client or SDK on your 
        local machine or in a workspace to access these files. 
        Instructions for these tools are available in the platform documentation.
      </p>
    ),
    active: true,
  },
};

export {
  BATCH_EXPORT_JOB_PREFIX, GUID_PREFIX_PATTERN, JOB_POLLING_INTERVAL, DOWNLOAD_FAIL_STATUS,
};
