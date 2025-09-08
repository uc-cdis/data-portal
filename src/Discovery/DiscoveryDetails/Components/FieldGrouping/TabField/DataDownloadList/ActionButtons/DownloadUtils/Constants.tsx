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

export const JOB_POLLING_INTERVAL = 5000;
