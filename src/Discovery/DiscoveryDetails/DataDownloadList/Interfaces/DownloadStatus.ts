interface DownloadStatus {
  inProgress:'DownloadVariableMetadata' | 'DownloadAllFiles' |
  'DownloadManifest'| 'DownloadStudyLevelMetadata'| '';
  message: {
    content: JSX.Element;
    active: boolean;
    title: string;
  };
}

export default DownloadStatus;
