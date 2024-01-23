interface DownloadStatus {
  inProgress: boolean;
  message: {
    content: JSX.Element;
    active: boolean;
    title: string;
  };
}

export default DownloadStatus;
