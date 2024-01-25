interface DownloadStatus {
  inProgress:'DownloadVariableMetadata' | 'DownloadAllFiles' |
  'DownloadManifest'| 'DownloadStudyLevelMetadata'| false;
  message: {
    content: JSX.Element;
    active: boolean;
    title: string;
  };
}

export default DownloadStatus;
