interface DownloadStatus {
  inProgress:'DownloadVariableMetadata' | 'DownloadDataFiles' |
  'DownloadManifest'| 'DownloadStudyLevelMetadata'| '' | boolean;
  message: {
    content: JSX.Element;
    active: boolean;
    title: string;
  };
}

export default DownloadStatus;
