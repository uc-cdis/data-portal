import { connect } from 'react-redux';
import SubmitTSV from './SubmitTSV';
import sessionMonitor from '../SessionMonitor';
import { getCounts } from '../DataModelGraph/ReduxDataModelGraph';
import { submissionApiPath, lineLimit } from '../localconf';
import { fetchWithCreds } from '../actions';
import { uploadTSV, updateFileContent } from './actions';

const submitToServer = (fullProject, methodIn = 'PUT') => (
  dispatch,
  getState
) => {
  const fileArray = [];
  const path = fullProject.split('-');
  const program = path[0];
  const project = path.slice(1).join('-');
  const { submission } = getState();
  const method = path === 'graphql' ? 'POST' : methodIn;
  let { file } = submission;

  dispatch({ type: 'RESET_SUBMISSION_STATUS' });

  if (!file) {
    return Promise.reject(new Error('No file to submit'));
  }
  if (submission.file_type !== 'text/tab-separated-values') {
    // remove line break in json file
    file = file.replace(/\r\n?|\n/g, '');
  }

  if (submission.file_type === 'text/tab-separated-values') {
    const fileSplited = file.split(/\r\n?|\n/g);
    if (fileSplited.length > lineLimit && lineLimit > 0) {
      let fileHeader = fileSplited[0];
      fileHeader += '\n';
      let count = lineLimit;
      let fileChunk = fileHeader;

      for (let i = 1; i < fileSplited.length; i += 1) {
        if (fileSplited[i] !== '') {
          fileChunk += fileSplited[i];
          fileChunk += '\n';
          count -= 1;
        }
        if (count === 0) {
          fileArray.push(fileChunk);
          fileChunk = fileHeader;
          count = lineLimit;
        }
      }
      if (fileChunk !== fileHeader) {
        fileArray.push(fileChunk);
      }
    } else {
      fileArray.push(file);
    }
  } else {
    fileArray.push(file);
  }

  let subUrl = submissionApiPath;
  if (program !== '_root') {
    subUrl = `${subUrl + program}/${project}/`;
  }

  const totalChunk = fileArray.length;

  function recursiveFetch(chunkArray) {
    if (chunkArray.length === 0) {
      return null;
    }

    return fetchWithCreds({
      path: subUrl,
      method,
      customHeaders: { 'Content-Type': submission.file_type },
      body: chunkArray.shift(),
      dispatch,
    })
      .then(recursiveFetch(chunkArray))
      .then(({ status, data }) => ({
        type: 'RECEIVE_SUBMISSION',
        submit_status: status,
        data,
        total: totalChunk,
      }))
      .then((msg) => dispatch(msg))
      .then(sessionMonitor.updateUserActivity());
  }

  return recursiveFetch(fileArray);
};

const mapStateToProps = (state) => ({
  submission: state.submission,
  dictionary: state.dictionary,
});

const mapDispatchToProps = (dispatch) => ({
  onUploadClick: (value, type) => dispatch(uploadTSV(value, type)),
  onSubmitClick: (project) => dispatch(submitToServer(project)),
  onFileChange: (value) => dispatch(updateFileContent(value)),
  onFinish: (type, project, dictionary) =>
    dispatch(getCounts(type, project, dictionary)),
});

const ReduxSubmitTSV = connect(mapStateToProps, mapDispatchToProps)(SubmitTSV);
export default ReduxSubmitTSV;
