interface User {
    username: string;
    fence_idp?: string; // eslint-disable-line camelcase
  }
  interface JobStatus {
    uid: string;
    status: 'Running' | 'Completed' | 'Failed' | 'Unknown';
    name: string;
  }
  interface DownloadStatus {
    inProgress: boolean;
    message: {
      content: JSX.Element;
      active: boolean;
      title: string;
    };
  }

export {
  User, JobStatus, DownloadStatus
};
