import FileSaver from 'file-saver';

const DownloadJsonFile = (fileName: string, data: object) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'text/json',
      });
      FileSaver.saveAs(blob, fileName +'.json');
}

export default DownloadJsonFile;
