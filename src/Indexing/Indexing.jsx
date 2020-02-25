import React from 'react';
import PropTypes from 'prop-types';
import FileSaver from 'file-saver';
import copy from 'clipboard-plus';
import Button from '@gen3/ui-component/dist/components/Button';
import { jsonToString } from '../utils';
import { indexdPath, userapiPath, fenceDownloadPath, sowerPath } from '../localconf';
import { fetchWithCreds } from '../actions';
import KeyTable from '../components/tables/KeyTable';
import { showArboristAuthzOnProfile, showFenceAuthzOnProfile } from '../configs';
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
      indexingFilesStatus: null,
      presignedURLForDownload: null,
      indexingFilesPopupMessage: '',
      indexingFilesJobStatus: null,

      // Download Manifest flow
      downloadManifestFileEnabled: true,
      uidOfManifestGenerationSowerJob: null,
      downloadManifestStatus: null,
      downloadManifestJobStatus: null
    };
    this.state = Object.assign({}, this.initialStateConfiguration);
  }

  resetAllPageForms = () => {
    this.setState(this.initialStateConfiguration);
    let forms = Array.from(document.getElementsByClassName('index-flow-form'));
    forms.map(x => x.reset());
  }
  
  onFormSubmit = (e) => {
      e.preventDefault() // Stop form submit
      this.fileUpload(this.state.uploadedFile).then((response)=>{
        console.log(response.data);
      })
  }

  onChange = (e) => {
    this.setState({uploadedFile:e.target.files[0], indexFilesButtonEnabled: true});
  };

  onHidePopup = () => {
    this.resetAllPageForms();
  }

  createBlankIndexdRecord = () => {
    var _this = this;
    let JSONbody = JSON.stringify({
      file_name: this.state.uploadedFile.name
    });
    console.log('POSTing to ', userapiPath + 'data/upload', ' with ', JSONbody);
    return fetchWithCreds({
      path: userapiPath + 'data/upload',
      method: 'POST',
      customHeaders: { 'Content-Type': 'application/json' },
      body: JSONbody,
      // dispatch,
    }).then((response) => {
      console.log('RESPONSE: ', response);
      _this.setState({ 
        guidOfIndexedFile: response.data.guid, 
        urlToIndexedFile: response.data.url,
        indexingFilesPopupMessage: 'Uploading index file to s3...'
      });
      
    });
  };

  fileUpload = (file) => {
    const url = 'http://example.com/file-upload';
    const formData = new FormData();
    formData.append('file', file);
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
  }

  indexFiles = async () => {
    this.setState({
      indexFilesButtonEnabled: false, 
      showIndexFilesPopup: true,
      indexingFilesPopupMessage: 'Preparing indexd...'
    });
    this.createBlankIndexdRecord().then(() => {
      return this.putIndexFileToSignedURL();
    });
  };

  putIndexFileToSignedURL = () => {
    var _this = this;
    console.log('PUTing to ', this.state.urlToIndexedFile  , ' with ', this.state.uploadedFile);
    
    return fetchWithCreds({
      path: _this.state.urlToIndexedFile,
      method: 'PUT',
      customHeaders: { 'Content-Type': 'application/json' },
      body: _this.state.uploadedFile,
    }).then((response) => {
      console.log(response);
      _this.setState({ 
        indexingFilesPopupMessage: 'Preparing indexing job...'
      });
      return _this.retrievePresignedURLForDownload(0, 5);
    });
  }

  retrievePresignedURLForDownload = (retrievePresignedURLRetries, maxRetries) => {
    var _this = this;
    return fetchWithCreds({
      path: fenceDownloadPath + '/' + this.state.guidOfIndexedFile,
      method: 'GET',
      customHeaders: { 'Content-Type': 'application/json' },
    }).then((response) => {
      console.log('GET URL: ', response);
      if (response.status.toString()[0] != '2' && retrievePresignedURLRetries < maxRetries) {
        setTimeout(function() {
          _this.retrievePresignedURLForDownload(retrievePresignedURLRetries + 1, maxRetries);
        } , 5000);
        return;
      }
      if (response.status.toString()[0] != '2' && retrievePresignedURLRetries >= maxRetries) {
        _this.setState({ 
          indexingFilesStatus: 'error',
          indexingFilesPopupMessage: 'There was a problem uploading the indexing file to s3 (' + response.status + ')',
          indexFilesButtonEnabled: false
        });
        return;
      }
      _this.setState({
        presignedURLForDownload : response.url,
        indexingFilesStatus: '',
        indexingFilesPopupMessage: 'Dispatching indexing job...'
      });
      _this.dispatchSowerIndexingJob();
    });
  }

  dispatchSowerIndexingJob = () => {
    var _this = this;
    return fetchWithCreds({
      path: sowerPath + 'dispatch',
      method: 'POST',
      customHeaders: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'action': 'indexing' , 'input': { "URL": this.state.presignedURLForDownload } })
    }).then((response) => {
      console.log('-----');
      console.log(response);
      console.log(response.status);
      console.log(response.data);
      if(response.status === 200 && response.data && response.data.uid) {
        this.setState({ 
          uidOfIndexingSowerJob : response.data.uid,
          indexingFilesPopupMessage: 'Indexing job is in progress. UID: ' + response.data.uid,
          indexingFilesStatus: ''
        });
        this.pollForIndexJobStatus();
      } else {
        let optionalPermissionsMessage = response.status == 403 ? '. Ensure your profile has the sower policy to allow job dispatching.' : '';
        this.setState({ 
          indexingFilesPopupMessage: 'Failed to dispatch indexing job. (' + response.status + ')' + optionalPermissionsMessage,
          indexingFilesStatus: 'error',
        });
      }
    });
  }

  dispatchSowerGenerateManifestJob = () => {
    var _this = this;
    return fetchWithCreds({
      path: sowerPath + 'dispatch',
      method: 'POST',
      customHeaders: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'action': 'download_manifest' })
    }).then((response) => {
      console.log('--2---');
      console.log(response);
      console.log(response.status);
      console.log(response.data);
      if(response.status === 200 && response.data && response.data.uid) {
        this.setState({ 
          uidOfManifestGenerationSowerJob: response.data.uid,
          downloadManifestPopupMessage: 'Manifest generation job is in progress. UID: ' + response.data.uid,
          downloadManifestStatus: ''
        });
        this.pollForIndexJobStatus();
      } else {
        let optionalPermissionsMessage = response.status == 403 ? '. Ensure your profile has the sower policy to allow job dispatching.' : '';
        this.setState({ 
          downloadManifestPopupMessage: 'Failed to dispatch download manifest job (' + response.status + ')' + optionalPermissionsMessage,
          downloadManifestStatus: 'error'
        });
      }
    });
  }

  retrieveJobOutput = (uid) => {
    var _this = this;
    return fetchWithCreds({
      path: sowerPath + 'output?UID=' + uid,
      method: 'GET',
      customHeaders: { 'Content-Type': 'application/json' }
    });
  }

  pollForIndexJobStatus = () => {
    var _this = this;
    return fetchWithCreds({
      path: sowerPath + 'status?UID=' + _this.state.uidOfIndexingSowerJob,
      method: 'GET',
      customHeaders: { 'Content-Type': 'application/json' }
    }).then((response) => {
      console.log('poll status:', response);
      if (response.data && response.data.status == 'Completed') {
        _this.retrieveJobOutput(_this.state.uidOfIndexingSowerJob).then(function(response) {
          console.log(response);
          if(response.data && response.data.output) {
            _this.setState({ 
              indexingFilesStatus: 'success',
              indexingFilesPopupMessage: 'Indexing job completed successfully.'
            });
          }
          else {
            _this.setState({ 
              indexingFilesStatus: 'error',
              indexingFilesPopupMessage: 'The indexing job failed to process the input file.'
            });
          }
        });
        return;
      }
      setTimeout(function() { _this.pollForIndexJobStatus(); }, 5000);
    });
  }

  pollForGenerateManifestJobStatus = () => {
    var _this = this;
    return fetchWithCreds({
      path: sowerPath + 'status?UID=' + _this.uidOfManifestGenerationSowerJob,
      method: 'GET',
      customHeaders: { 'Content-Type': 'application/json' }
    }).then((response) => {
      console.log('poll status:', response);
      if (response.data && response.data.status == 'Completed') {
        _this.retrieveJobOutput(_this.state.uidOfManifestGenerationSowerJob).then(function(response) {
          console.log(response);
          if(response.data && response.data.output) {
            _this.setState({ 
              downloadManifestStatus: 'success',
              downloadManifestPopupMessage: 'Indexing job completed successfully.'
            });
          }
          else {
            _this.setState({ 
              downloadManifestStatus: 'error',
              downloadManifestPopupMessage: 'The indexing job failed to process the input file.'
            });
          }
        });
        return;  
      }
      setTimeout(function() { _this.pollForGenerateManifestJobStatus(); }, 5000);
    });
  }

  download = async () => {
    this.setState({
      showDownloadManifestPopup: true,
      downloadManifestButtonEnabled: false,
      downloadManifestPopupMessage: 'Dispatching manifest generation job...'
    });
    this.dispatchSowerGenerateManifestJob();
  };

  render = () => {
    return (
      <div className='indexing-page'>
          <div>
            <div className='action-panel'>
              <div className='action-panel-title'>
                Index Data Files
              </div>
              <div className='action-panel-body'>
                <p>An indexing file, or file manifest, is a TSV containing information about
                files that exist in cloud storage. Rows of importance include the MD5 sum of the file,
                a link to the file, the filename, and its size.</p>

                <p>Upload an indexing file below to create records in indexd for new object files.</p>
                <br/>
                <form className='index-flow-form'>
                  <input type="file" onChange={this.onChange} />
                </form>
              </div>
              <div className='action-panel-footer'>
                  <Button
                    onClick={this.indexFiles}
                    label='Index Files'
                    rightIcon="upload"
                    className='g3-button'
                    buttonType='primary'
                    enabled={ this.state.indexFilesButtonEnabled }
                  />
              </div>
            </div>
            {
              this.state.showIndexFilesPopup &&
                (<Popup
                  message={''}
                  title='Indexing Files'
                  rightButtons={[
                    {
                      caption: 'Cancel',
                      fn: () => this.onHidePopup()
                    },
                  ]}
                  onClose={() => this.onHidePopup()}
                >
                { this.state.indexingFilesStatus == 'error' ? 
                  <div className='index-files-popup-text'>
                    <br/>
                    <div className='index-files-popup-big-icon'>
                      <IconComponent iconName='status_error' dictIcons={dictIcons} />
                    </div>
                    <p>{ this.state.indexingFilesPopupMessage }</p>
                    <p>If the problem persists, please contact your commons administrator.</p>
                  </div>
                : ( this.state.indexingFilesStatus == 'success' ?
                    <React.Fragment>
                      <div className='index-files-popup-big-icon'>
                        <IconComponent iconName='status_error' dictIcons={dictIcons} />
                      </div>
                      <div className='index-files-popup-text'>
                        <br/>
                        <p> Status: { this.state.indexingFilesPopupMessage } </p>
                        <p>It may take several minutes to complete the indexing flow.</p>
                        <p>Please do not navigate away from this page until the operation is complete.</p>
                      </div>
                    </React.Fragment>
                  :
                    <React.Fragment>
                      <Spinner caption='' type='spinning' />
                      <div className='index-files-popup-text'>
                        <br/>
                        <p> Status: { this.state.indexingFilesPopupMessage } </p>
                        <p>It may take several minutes to complete the indexing flow.</p>
                        <p>Please do not navigate away from this page until the operation is complete.</p>
                      </div>
                    </React.Fragment> )
                }
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
                      fn: () => this.onHidePopup()
                    },
                  ]}
                  onClose={() => this.onHidePopup()}
                >
                { this.state.downloadManifestStatus == 'error' ? 
                  <div className='index-files-popup-text'>
                    <br/>
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
                      <br/>
                      <p> Status: { this.state.downloadManifestPopupMessage} </p>
                      <p>It may take several minutes to generate the file manifest.</p>
                      <p>Please do not navigate away from this page until the operation is complete.</p>
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
                    rightIcon="download"
                    className='g3-button'
                    buttonType='primary'
                    enabled={ this.state.downloadManifestFileEnabled }
                  />
              </div>
            </div>
          </div>
      </div>
    );
  }
};

Indexing.propTypes = {
  user: PropTypes.object.isRequired,
  userProfile: PropTypes.object.isRequired,
  userAuthMapping: PropTypes.object.isRequired,
  popups: PropTypes.object.isRequired,
  submission: PropTypes.object,
  onClearCreationSession: PropTypes.func.isRequired,
  onCreateKey: PropTypes.func.isRequired,
  onUpdatePopup: PropTypes.func.isRequired,
  onDeleteKey: PropTypes.func.isRequired,
  onRequestDeleteKey: PropTypes.func.isRequired,
  onClearDeleteSession: PropTypes.func.isRequired,
};

Indexing.defaultProps = {
  submission: {},
};

export default Indexing;
