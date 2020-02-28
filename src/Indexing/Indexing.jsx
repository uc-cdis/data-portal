import React from 'react';
import FileSaver from 'file-saver';
import Button from '@gen3/ui-component/dist/components/Button';
import { userapiPath, fenceDownloadPath, sowerPath } from '../localconf';
import { fetchWithCreds } from '../actions';
import './Indexing.less';
import Popup from '../components/Popup';
import Spinner from '../components/Spinner';
import IconComponent from '../components/Icon';
import dictIcons from '../img/icons/index';

export const saveToFile = (savingStr, filename) => {
  const blob = new Blob([savingStr], { type: 'text/json' });
  FileSaver.saveAs(blob, filename);
};

class Indexing extends React.Component {
  constructor(props) {
    super(props);
    

    this.initialStateConfiguration = {
      // Index Files flow
      uploadedFile: null,
      indexFilesButtonEnabled: false,
      guidOfIndexedFile: null,
      urlToIndexedFile: null,
      showIndexFilesPopup: false,
      showDownloadManifestPopup: false,
      indexingFilesStatus: 'running',
      presignedURLForDownload: null,
      indexingFilesPopupMessage: '',
      indexingFilesStatusLastUpdated: this.getCurrentTime(),

      // Download Manifest flow
      downloadManifestFileEnabled: true,
      uidOfManifestGenerationSowerJob: null,
      downloadManifestStatus: null,
      downloadManifestStatusLastUpdated: this.getCurrentTime(),
    };
    this.state = Object.assign({}, this.initialStateConfiguration);
  }

  getCurrentTime = () => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;
    return dateTime;
  }

  onFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', this.state.uploadedFile);
  }

  onChange = (e) => {
    this.setState({ uploadedFile: e.target.files[0], indexFilesButtonEnabled: true });
  };

  onHidePopup = () => {
    this.resetAllPageForms();
  }

  resetAllPageForms = () => {
    this.setState(this.initialStateConfiguration);
    const forms = Array.from(document.getElementsByClassName('index-flow-form'));
    forms.map(x => x.reset());
  }

  createBlankIndexdRecord = () => {
    const thisPointer = this;
    const JSONbody = JSON.stringify({
      file_name: this.state.uploadedFile.name,
    });
    return fetchWithCreds({
      path: `${userapiPath}data/upload`,
      method: 'POST',
      customHeaders: { 'Content-Type': 'application/json' },
      body: JSONbody,
    }).then((response) => {
      thisPointer.setState({
        guidOfIndexedFile: response.data.guid,
        urlToIndexedFile: response.data.url,
        indexingFilesPopupMessage: 'Uploading index file to s3...',
      });
    });
  };

  indexFiles = async () => {
    this.setState({
      indexFilesButtonEnabled: false,
      showIndexFilesPopup: true,
      indexingFilesPopupMessage: 'Preparing indexd...',
    });
    this.createBlankIndexdRecord().then(() => this.putIndexFileToSignedURL());
  };

  putIndexFileToSignedURL = () => {
    const thisPointer = this;
    return fetchWithCreds({
      path: thisPointer.state.urlToIndexedFile,
      method: 'PUT',
      customHeaders: { 'Content-Type': 'application/json' },
      body: thisPointer.state.uploadedFile,
    }).then(() => {
      thisPointer.setState({
        indexingFilesPopupMessage: 'Preparing indexing job...',
      });
      return thisPointer.retrievePresignedURLForDownload(0, 5);
    });
  }

  retrievePresignedURLForDownload = (retrievePresignedURLRetries, maxRetries) => {
    const thisPointer = this;
    return fetchWithCreds({
      path: `${fenceDownloadPath}/${this.state.guidOfIndexedFile}`,
      method: 'GET',
      customHeaders: { 'Content-Type': 'application/json' },
    }).then((response) => {
      if (response.status.toString()[0] !== '2' && retrievePresignedURLRetries < maxRetries) {
        setTimeout(() => {
          thisPointer.retrievePresignedURLForDownload(retrievePresignedURLRetries + 1, maxRetries);
        }, 5000);
        return;
      }
      if (response.status.toString()[0] !== '2' && retrievePresignedURLRetries >= maxRetries) {
        thisPointer.setState({
          indexingFilesStatus: 'error',
          indexingFilesStatusLastUpdated: this.getCurrentTime(),
          indexingFilesPopupMessage: `There was a problem uploading the indexing file to s3 (${response.status})`,
          indexFilesButtonEnabled: false,
        });
        return;
      }
      thisPointer.setState({
        presignedURLForDownload: response.data.url,
        indexingFilesPopupMessage: 'Dispatching indexing job...',
      });
      thisPointer.dispatchSowerIndexingJob();
    });
  }

  dispatchSowerIndexingJob = () => {
    const JSONbody = {
      action: 'indexing',
      input: { URL: this.state.presignedURLForDownload },
    };
    return fetchWithCreds({
      path: `${sowerPath}dispatch`,
      method: 'POST',
      customHeaders: { 'Content-Type': 'application/json' },
      body: JSON.stringify(JSONbody),
    }).then((response) => {
      if (response.status === 200 && response.data && response.data.uid) {
        this.setState({
          uidOfIndexingSowerJob: response.data.uid,
          indexingFilesPopupMessage: `Indexing job is in progress. UID: ${response.data.uid}`,
        });
        this.pollForIndexJobStatus();
      } else {
        const optionalPermissionsMessage = response.status === 403 ? '. Ensure your profile has the sower policy to allow job dispatching.' : '';
        this.setState({
          indexingFilesPopupMessage: `Failed to dispatch indexing job. (${response.status})${optionalPermissionsMessage}`,
          indexingFilesStatus: 'error',
          indexingFilesStatusLastUpdated: this.getCurrentTime(),
        });
      }
    });
  }

  dispatchSowerGenerateManifestJob = () => fetchWithCreds({
    path: `${sowerPath}dispatch`,
    method: 'POST',
    customHeaders: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'download_manifest' }),
  }).then((response) => {
    if (response.status === 200 && response.data && response.data.uid) {
      this.setState({
        uidOfManifestGenerationSowerJob: response.data.uid,
        downloadManifestPopupMessage: `Manifest generation job is in progress. UID: ${response.data.uid}`,
        downloadManifestStatus: '',
        downloadManifestStatusLastUpdated: this.getCurrentTime(),
      });
      this.pollForIndexJobStatus();
    } else {
      const optionalPermissionsMessage = response.status === 403 ? '. Ensure your profile has the sower policy to allow job dispatching.' : '';
      this.setState({
        downloadManifestPopupMessage: `Failed to dispatch download manifest job (${response.status})${optionalPermissionsMessage}`,
        downloadManifestStatus: 'error',
        downloadManifestStatusLastUpdated: this.getCurrentTime(),
      });
    }
  })


  retrieveJobOutput = uid => fetchWithCreds({
    path: `${sowerPath}output?UID=${uid}`,
    method: 'GET',
    customHeaders: { 'Content-Type': 'application/json' },
  })

  pollForIndexJobStatus = () => {
    const thisPointer = this;
    return fetchWithCreds({
      path: `${sowerPath}status?UID=${thisPointer.state.uidOfIndexingSowerJob}`,
      method: 'GET',
      customHeaders: { 'Content-Type': 'application/json' },
    }).then((response) => {
      if (response.data && response.data.status === 'Completed') {
        thisPointer.retrieveJobOutput(thisPointer.state.uidOfIndexingSowerJob).then((resp) => {
          if (resp.data && resp.data.output) {
            const logsLink = resp.data.output.split(' ')[0];
            thisPointer.setState({
              indexingFilesStatus: 'success',
              indexingFilesStatusLastUpdated: this.getCurrentTime(),
              indexingFilesPopupMessage: 'Done',
              indexingFilesLogsLink: logsLink,
            });
          } else {
            thisPointer.setState({
              indexingFilesStatus: 'error',
              indexingFilesStatusLastUpdated: this.getCurrentTime(),
              indexingFilesPopupMessage: 'The indexing job failed to process the input file.',
            });
          }
        });
        return;
      } else if (response.data && response.data.status === 'Failed') {
        thisPointer.setState({
          indexingFilesStatus: 'error',
          indexingFilesStatusLastUpdated: this.getCurrentTime(),
          indexingFilesPopupMessage: 'The indexing job failed to process the input file.',
        });
        return;
      }
      setTimeout(() => { thisPointer.pollForIndexJobStatus(); }, 5000);
    });
  }

  pollForGenerateManifestJobStatus = () => {
    const thisPointer = this;
    return fetchWithCreds({
      path: `${sowerPath}status?UID=${thisPointer.uidOfManifestGenerationSowerJob}`,
      method: 'GET',
      customHeaders: { 'Content-Type': 'application/json' },
    }).then((response) => {
      if (response.data && response.data.status === 'Completed') {
        thisPointer.retrieveJobOutput(thisPointer.state.uidOfManifestGenerationSowerJob).then(
          (resp) => {
            if (resp.data && resp.data.output) {
              thisPointer.setState({
                downloadManifestStatus: 'success',
                downloadManifestPopupMessage: 'Indexing job completed successfully.',
                downloadManifestStatusLastUpdated: this.getCurrentTime(),
              });
            } else {
              thisPointer.setState({
                downloadManifestStatus: 'error',
                downloadManifestPopupMessage: 'The indexing job failed to process the input file.',
                downloadManifestStatusLastUpdated: this.getCurrentTime(),
              });
            }
          });
        return;
      }
      setTimeout(() => { thisPointer.pollForGenerateManifestJobStatus(); }, 5000);
    });
  }

  downloadIndexingFileOutput = () => {
    const link = document.createElement('a');
    link.href = this.state.indexingFilesLogsLink;
    document.body.appendChild(link);
    link.click();
  }

  download = async () => {
    this.setState({
      showDownloadManifestPopup: true,
      downloadManifestButtonEnabled: false,
      downloadManifestPopupMessage: 'Dispatching manifest generation job...',
    });
    this.dispatchSowerGenerateManifestJob();
  };

  render = () => {
    const successPopupBlock = (
      <React.Fragment>
        <div className='index-files-popup-big-icon'>
          <div className='index-files-circle-border'>
            <IconComponent iconName='checkbox' dictIcons={dictIcons} />
          </div>
        </div>
        <div className='index-files-popup-text'>
          <br />
          <p>
            <b>Status</b>:
            <span className='index-files-green-label'>{ this.state.indexingFilesPopupMessage }</span>
            <p className='index-files-page-last-updated'>
              Last updated: { this.state.downloadManifestStatusLastUpdated }
            </p>
          </p>
        </div>
      </React.Fragment>
    );

    const errorPopupBlock = (
      <div className='index-files-popup-text'>
        <br />
        <div className='index-files-popup-big-icon'>
          <IconComponent iconName='status_error' dictIcons={dictIcons} />
        </div>
        <p className='index-files-page-last-updated'>
          Last updated: { this.state.downloadManifestStatusLastUpdated }
        </p>
        <p>{ this.state.indexingFilesPopupMessage }</p>
        <p>If the problem persists, please contact your commons administrator.</p>
      </div>
    );

    const runningPopupBlock = (
      <React.Fragment>
        <Spinner caption='' type='spinning' />
        <div className='index-files-popup-text'>
          <br />
          <p><b>Status</b>: { this.state.indexingFilesPopupMessage } </p>
          <p className='index-files-page-last-updated'>
            Last updated: { this.state.downloadManifestStatusLastUpdated }
          </p>
          <br />
          <p>It may take several minutes to complete the indexing flow.</p>
          <p>Please do not navigate away from this page until
          the operation is complete.</p>
        </div>
      </React.Fragment>
    );

    const popupBlocks = {
      success: successPopupBlock,
      error: errorPopupBlock,
      running: runningPopupBlock,
    };

    return (
      <div className='indexing-page'>
        <div>
          <div className='action-panel'>
            <div className='action-panel-title'>
                  Index Data Files
            </div>
            <div className='action-panel-body'>
              <p>An indexing file, or file manifest, is a TSV containing information about
                  files that exist in cloud storage.
                  Rows of importance include the MD5 sum of the file,
                  a link to the file, the filename, and its size.</p>

              <p>Upload an indexing file below to create records in indexd for new object files.</p>
              <br />
              <form className='index-flow-form'>
                <input type='file' onChange={this.onChange} />
              </form>
            </div>
            <div className='action-panel-footer'>
              <Button
                onClick={this.indexFiles}
                label='Index Files'
                rightIcon='upload'
                className='g3-button'
                buttonType='primary'
                enabled={this.state.indexFilesButtonEnabled}
              />
            </div>
          </div>
          {
            this.state.showIndexFilesPopup &&
                  (<Popup
                    message={''}
                    title='Indexing Files'
                    rightButtons={this.state.indexingFilesStatus !== 'success' ? [
                      {
                        caption: 'Cancel',
                        fn: () => this.onHidePopup(),
                      },
                    ] : [
                      {
                        caption: 'Download Logs',
                        icon: 'download',
                        fn: () => this.downloadIndexingFileOutput(),
                      },
                    ]}
                    onClose={() => this.onHidePopup()}
                  >
                    { popupBlocks[this.state.indexingFilesStatus] }
                  </Popup>)
          }

          {
            this.state.showDownloadManifestPopup &&
                  (<Popup
                    message={''}
                    title='Downloading Indexing File'
                    rightButtons={[
                      {
                        caption: 'Cancel',
                        fn: () => this.onHidePopup(),
                      },
                    ]}
                    onClose={() => this.onHidePopup()}
                  >
                    { this.state.downloadManifestStatus === 'error' ?
                      <div className='index-files-popup-text'>
                        <br />
                        <div className='index-files-popup-big-icon'>
                          <IconComponent iconName='status_error' dictIcons={dictIcons} />
                        </div>
                        <p>{ this.state.downloadManifestPopupMessage }</p>
                        <p>If the problem persists, please contact your commons administrator.</p>
                      </div>
                      :
                      <React.Fragment>
                        <Spinner caption='' type='spinning' />
                        <div className='index-files-popup-text'>
                          <br />
                          <p><b>Status</b>: { this.state.downloadManifestPopupMessage} </p>
                          <p className='index-files-page-last-updated'>
                            Last updated: { this.state.downloadManifestStatusLastUpdated }
                          </p>
                          <br />
                          <p>It may take several minutes to generate the file manifest.</p>
                          <p>Please do not navigate away from this page until
                          the operation is complete.</p>
                        </div>
                      </React.Fragment> }
                  </Popup>)
          }
          <div className='action-panel'>
            <div className='action-panel-title'>
                  Download Indexing File
            </div>
            <div className='action-panel-body'>
                  Clicking the download button below will generate and return a TSV containing
                  the information related to all file records in indexd. Columns returned include
                  GUID, cloud storage URLs, filename, file size, and MD5 hash.
            </div>
            <div className='action-panel-footer'>
              <Button
                // key={buttonConfig.type}
                onClick={this.download}
                label='Download'
                // leftIcon={buttonConfig.leftIcon}
                rightIcon='download'
                className='g3-button'
                buttonType='primary'
                enabled={this.state.downloadManifestFileEnabled}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Indexing.propTypes = {

};

Indexing.defaultProps = {

};

export default Indexing;
