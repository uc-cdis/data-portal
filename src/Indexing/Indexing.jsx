import React from 'react';
import Button from '@gen3/ui-component/dist/components/Button';
import {
  userAPIPath, fenceDownloadPath, jobAPIPath, hostname,
} from '../localconf';
import { fetchWithCreds } from '../actions';
import './Indexing.less';
import Popup from '../components/Popup';
import Spinner from '../components/Spinner';
import IconComponent from '../components/Icon';
import dictIcons from '../img/icons/index';

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
      // uidOfManifestGenerationSowerJob: null,
      downloadManifestStatus: 'running',
      downloadManifestStatusLastUpdated: this.getCurrentTime(),
    };
    this.state = { ...this.initialStateConfiguration };
  }

  onChange = (e) => {
    this.setState({ uploadedFile: e.target.files[0], indexFilesButtonEnabled: true });
  };

  onHidePopup = () => {
    this.resetAllPageForms();
  }

  getCurrentTime = () => {
    const today = new Date();
    const date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    const dateTime = `${date} ${time}`;
    return dateTime;
  }

  resetAllPageForms = () => {
    this.setState(this.initialStateConfiguration);
    const forms = Array.from(document.getElementsByClassName('index-flow-form'));
    forms.map((x) => x.reset());
  }

  createBlankIndexdRecord = () => {
    const thisPointer = this;
    const JSONbody = JSON.stringify({
      file_name: this.state.uploadedFile.name,
    });
    return fetchWithCreds({
      path: `${userAPIPath}data/upload`,
      method: 'POST',
      customHeaders: { 'Content-Type': 'application/json' },
      body: JSONbody,
    }).then((response) => {
      if (response.data && response.data.guid && response.data.url) {
        thisPointer.setState({
          guidOfIndexedFile: response.data.guid,
          urlToIndexedFile: response.data.url,
          indexingFilesPopupMessage: 'Uploading index file to s3...',
        });
        return response;
      }
      thisPointer.setState({
        indexingFilesStatus: 'error',
        indexingFilesStatusLastUpdated: thisPointer.getCurrentTime(),
        indexingFilesPopupMessage: `There was a problem creating a placeholder record in Indexd via Fence (${response.status}).`,
        indexFilesButtonEnabled: false,
      });
      return null;
    });
  };

  indexFiles = async () => {
    const thisPointer = this;
    this.setState({
      indexFilesButtonEnabled: false,
      showIndexFilesPopup: true,
      indexingFilesPopupMessage: 'Preparing indexd...',
    });
    this.createBlankIndexdRecord().then((response) => {
      if (response) {
        thisPointer.putIndexFileToSignedURL();
      } else {
        // eslint-disable-next-line no-console
        console.error('Aborting indexing due to error response from /data/upload.');
      }
    });
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
      return thisPointer.retrievePresignedURLForDownload(0, 150);
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      thisPointer.setState({
        indexingFilesStatus: 'error',
        indexingFilesStatusLastUpdated: thisPointer.getCurrentTime(),
        indexingFilesPopupMessage: 'There was a problem uploading the indexing file to s3. Check the AWS configuration.',
        indexFilesButtonEnabled: false,
      });
    });
  }

  retrievePresignedURLForDownload = (retrievePresignedURLRetries, maxRetries) => {
    const thisPointer = this;
    return fetchWithCreds({
      path: `${fenceDownloadPath}/${thisPointer.state.guidOfIndexedFile}`,
      method: 'GET',
      customHeaders: { 'Content-Type': 'application/json' },
    }).then((response) => {
      const wasSuccessful = (response.status.toString()[0] === '2' && (response.data && response.data.url));
      if (!wasSuccessful && retrievePresignedURLRetries < maxRetries) {
        setTimeout(() => {
          thisPointer.retrievePresignedURLForDownload(retrievePresignedURLRetries + 1, maxRetries);
        }, 5000);
        return;
      }
      if (!wasSuccessful && retrievePresignedURLRetries >= maxRetries) {
        thisPointer.setState({
          indexingFilesStatus: 'error',
          indexingFilesStatusLastUpdated: thisPointer.getCurrentTime(),
          indexingFilesPopupMessage: `There was a problem uploading the indexing file to s3 (${response.status}). The upload timed out.`,
          indexFilesButtonEnabled: false,
        });
        return;
      }
      thisPointer.setState({
        presignedURLForDownload: response.data.url,
        indexingFilesPopupMessage: 'Dispatching indexing job...',
        indexingFilesStatusLastUpdated: this.getCurrentTime(),
      });
      thisPointer.dispatchSowerIndexingJob();
    });
  }

  dispatchSowerIndexingJob = () => {
    const JSONbody = {
      action: 'index-object-manifest',
      input: { URL: this.state.presignedURLForDownload },
    };
    return fetchWithCreds({
      path: `${jobAPIPath}dispatch`,
      method: 'POST',
      customHeaders: { 'Content-Type': 'application/json' },
      body: JSON.stringify(JSONbody),
    }).then((response) => {
      if (response.status === 200 && response.data && response.data.uid) {
        this.setState({
          indexingFilesPopupMessage: `Indexing job is in progress. UID: ${response.data.uid}`,
        });
        this.pollForIndexJobStatus(response.data.uid);
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

  dispatchSowerGenerateManifestJob = () => {
    const JSONbody = {
      action: 'download-indexd-manifest',
      input: {
        host: hostname,
        max_concurrent_requests: 20,
        num_processes: 4,
      },
    };
    fetchWithCreds({
      path: `${jobAPIPath}dispatch`,
      method: 'POST',
      customHeaders: { 'Content-Type': 'application/json' },
      body: JSON.stringify(JSONbody),
    }).then((response) => {
      if (response.status === 200 && response.data && response.data.uid) {
        this.setState({
          // uidOfManifestGenerationSowerJob: response.data.uid,
          downloadManifestPopupMessage: `Manifest generation job is in progress. UID: ${response.data.uid}`,
          downloadManifestStatus: 'running',
          downloadManifestStatusLastUpdated: this.getCurrentTime(),
        });
        this.pollForGenerateManifestJobStatus(response.data.uid);
      } else {
        const optionalPermissionsMessage = response.status === 403 ? '. Ensure your profile has the sower policy to allow job dispatching.' : '';
        this.setState({
          downloadManifestPopupMessage: `Failed to dispatch download manifest job (${response.status})${optionalPermissionsMessage}`,
          downloadManifestStatus: 'error',
          downloadManifestStatusLastUpdated: this.getCurrentTime(),
        });
      }
    });
  }

  retrieveJobOutput = (uid) => fetchWithCreds({
    path: `${jobAPIPath}output?UID=${uid}`,
    method: 'GET',
    customHeaders: { 'Content-Type': 'application/json' },
  })

  pollForIndexJobStatus = (uid) => {
    const thisPointer = this;
    return fetchWithCreds({
      path: `${jobAPIPath}status?UID=${uid}`,
      method: 'GET',
      customHeaders: { 'Content-Type': 'application/json' },
    }).then((response) => {
      if (response.data && response.data.status === 'Completed') {
        thisPointer.retrieveJobOutput(uid).then((resp) => {
          if (resp.data && resp.data.output) {
            const logsLink = resp.data.output.split(' ')[0];
            const manifestLink = resp.data.output.split(' ')[1];
            thisPointer.setState({
              indexingFilesStatus: 'success',
              indexingFilesStatusLastUpdated: thisPointer.getCurrentTime(),
              indexingFilesPopupMessage: 'Done',
              indexingFilesLogsLink: logsLink,
              indexingFilesManifestLink: manifestLink,
            });
          } else {
            thisPointer.setState({
              indexingFilesStatus: 'error',
              indexingFilesStatusLastUpdated: thisPointer.getCurrentTime(),
              indexingFilesPopupMessage: 'The indexing job was dispatched, but failed to process the input file.',
            });
          }
        });
        return;
      } if (response.data && response.data.status === 'Failed') {
        thisPointer.setState({
          indexingFilesStatus: 'error',
          indexingFilesStatusLastUpdated: thisPointer.getCurrentTime(),
          indexingFilesPopupMessage: 'The indexing job was dispatched, but failed to process the input file.',
        });
        return;
      }
      setTimeout(() => { thisPointer.pollForIndexJobStatus(uid); }, 5000);
    });
  }

  pollForGenerateManifestJobStatus = (uid) => {
    const thisPointer = this;
    return fetchWithCreds({
      path: `${jobAPIPath}status?UID=${uid}`,
      method: 'GET',
      customHeaders: { 'Content-Type': 'application/json' },
    }).then((response) => {
      if (response.data && response.data.status === 'Completed') {
        thisPointer.retrieveJobOutput(uid).then(
          (resp) => {
            if (resp.data && resp.data.output) {
              const manifestLink = resp.data.output.split(' ')[0];
              const logsLink = resp.data.output.split(' ')[1];
              thisPointer.setState({
                downloadManifestLogsLink: logsLink,
                downloadManifestManifestLink: manifestLink,
                downloadManifestStatus: 'success',
                downloadManifestPopupMessage: 'Done',
                downloadManifestStatusLastUpdated: thisPointer.getCurrentTime(),
              });
            } else {
              thisPointer.setState({
                downloadManifestStatus: 'error',
                downloadManifestStatusLastUpdated: thisPointer.getCurrentTime(),
                downloadManifestPopupMessage: 'The manifest generation job was dispatched, but failed to produce output.',
              });
            }
          });
        return;
      } if (response.data && response.data.status === 'Failed') {
        thisPointer.setState({
          downloadManifestStatus: 'error',
          downloadManifestPopupMessage: 'The manifest generation job was dispatched, but failed to produce output.',
          downloadManifestStatusLastUpdated: thisPointer.getCurrentTime(),
        });
        return;
      }
      setTimeout(() => { thisPointer.pollForGenerateManifestJobStatus(uid); }, 5000);
    });
  }

  downloadJobOutput = (linkToFile) => {
    const link = document.createElement('a');
    link.href = linkToFile;
    link.click();
    document.body.appendChild(link);
  }

  download = async () => {
    this.setState({
      showDownloadManifestPopup: true,
      downloadManifestPopupMessage: 'Dispatching manifest generation job...',
    });
    this.dispatchSowerGenerateManifestJob();
  };

  render = () => {
    const indexFilesSuccessPopupBlock = (
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
          </p>
          <p className='index-files-page-last-updated'>
            Last updated: { this.state.indexingFilesStatusLastUpdated }
          </p>
        </div>
      </React.Fragment>
    );

    const indexFilesErrorPopupBlock = (
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

    const indexFilesRunningPopupBlock = (
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
          the operation is complete.
          </p>
        </div>
      </React.Fragment>
    );

    const indexFilesPopupBlocks = {
      success: indexFilesSuccessPopupBlock,
      error: indexFilesErrorPopupBlock,
      running: indexFilesRunningPopupBlock,
    };

    const downloadManifestSuccessPopupBlock = (
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
            <span className='index-files-green-label'>{ this.state.downloadManifestPopupMessage }</span>
          </p>
          <p className='index-files-page-last-updated'>
            Last updated: { this.state.downloadManifestStatusLastUpdated }
          </p>
        </div>
      </React.Fragment>
    );

    const downloadManifestErrorPopupBlock = (
      <div className='index-files-popup-text'>
        <br />
        <div className='index-files-popup-big-icon'>
          <IconComponent iconName='status_error' dictIcons={dictIcons} />
        </div>
        <p>{ this.state.downloadManifestPopupMessage }</p>
        <p>If the problem persists, please contact your commons administrator.</p>
      </div>
    );

    const downloadManifestRunningPopupBlock = (
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
          the operation is complete.
          </p>
        </div>
      </React.Fragment>
    );

    const downloadManifestPopupBlocks = {
      success: downloadManifestSuccessPopupBlock,
      error: downloadManifestErrorPopupBlock,
      running: downloadManifestRunningPopupBlock,
    };

    const downloadManifestSuccessButtons = [];
    if (this.state.downloadManifestLogsLink) {
      downloadManifestSuccessButtons.push({
        caption: 'Download Logs',
        icon: 'download',
        value: this.state.downloadManifestLogsLink,
        fn: () => this.downloadJobOutput(this.state.downloadManifestLogsLink),
      });
    }
    downloadManifestSuccessButtons.push({
      caption: 'Download Manifest',
      icon: 'download',
      value: this.state.downloadManifestManifestLink,
      fn: () => this.downloadJobOutput(this.state.downloadManifestManifestLink),
    });

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
                  a link to the file, the filename, and its size.
              </p>

              <p>Upload an indexing file below to create records in indexd for new object files.</p>
              <br />
              <form className='index-flow-form'>
                <input type='file' accept='.tsv' onChange={this.onChange} />
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
            this.state.showIndexFilesPopup
                  && (
                    <Popup
                      message={['']}
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
                          value: this.state.indexingFilesLogsLink,
                          fn: () => this.downloadJobOutput(this.state.indexingFilesLogsLink),
                        },
                        {
                          caption: 'Download Manifest',
                          icon: 'download',
                          value: this.state.indexingFilesManifestLink,
                          fn: () => this.downloadJobOutput(this.state.indexingFilesManifestLink),
                        },
                      ]}
                      onClose={() => this.onHidePopup()}
                    >
                      { indexFilesPopupBlocks[this.state.indexingFilesStatus] }
                    </Popup>
                  )
          }

          {
            this.state.showDownloadManifestPopup
                  && (
                    <Popup
                      message={['']}
                      title='Downloading Indexing File'
                      rightButtons={this.state.downloadManifestStatus !== 'success' ? [
                        {
                          caption: 'Cancel',
                          fn: () => this.onHidePopup(),
                        },
                      ] : downloadManifestSuccessButtons}
                      onClose={() => this.onHidePopup()}
                    >
                      { downloadManifestPopupBlocks[this.state.downloadManifestStatus] }
                    </Popup>
                  )
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
