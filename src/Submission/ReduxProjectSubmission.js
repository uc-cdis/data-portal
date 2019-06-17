import { connect } from 'react-redux';
import ProjectSubmission from './ProjectSubmission';
import SubmitTSV from './SubmitTSV';
import SubmitForm from './SubmitForm';
import sessionMonitor from '../SessionMonitor';
import ReduxDataModelGraph, { getCounts } from '../DataModelGraph/ReduxDataModelGraph';

import { fetchWithCreds } from '../actions';
import { predictFileType } from '../utils';
import { submissionApiPath, lineLimit } from '../localconf';

export const uploadTSV = (value, type) => (dispatch) => {
  dispatch({ type: 'REQUEST_UPLOAD', file: value, file_type: type });
};

export const updateFormSchema = formSchema => ({
  type: 'UPDATE_FORM_SCHEMA',
  formSchema,
});

export const updateFileContent = (value, fileType) => (dispatch) => {
  dispatch({ type: 'UPDATE_FILE', file: value, file_type: predictFileType(value, fileType) });
};


const submitToServer = (fullProject, methodIn = 'PUT') => (dispatch, getState) => {
  const fileArray = [];
  const path = fullProject.split('-');
  const program = path[0];
  const project = path.slice(1).join('-');
  const submission = getState().submission;
  const method = path === 'graphql' ? 'POST' : methodIn;
  let file = submission.file;

  dispatch({ type: 'RESET_SUBMISSION_STATUS' });

  if (!file) {
    return Promise.reject('No file to submit');
  } else if (submission.file_type !== 'text/tab-separated-values') {
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
    }).then(recursiveFetch(chunkArray)).then(
      ({ status, data }) => (
        {
          type: 'RECEIVE_SUBMISSION',
          submit_status: status,
          data,
          total: totalChunk,
        }),
    ).then(msg => dispatch(msg))
      .then(sessionMonitor.updateUserActivity());
  }

  return recursiveFetch(fileArray);
};

const ReduxSubmitTSV = (() => {
  const mapStateToProps = state => ({
    submission: state.submission,
    dictionary: state.dictionary,
  });

  const mapDispatchToProps = dispatch => ({
    onUploadClick: (value, type) => dispatch(uploadTSV(value, type)),
    onSubmitClick: project => dispatch(submitToServer(project)),
    onFileChange: value => dispatch(updateFileContent(value)),
    onFinish: (type, project, dictionary) =>
      dispatch(getCounts(type, project, dictionary)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(SubmitTSV);
})();


const ReduxSubmitForm = (() => {
  const mapStateToProps = state => ({
    submission: state.submission,
  });

  const mapDispatchToProps = dispatch => ({
    onUploadClick: (value, type) => dispatch(uploadTSV(value, type)),
    onUpdateFormSchema: (formSchema => dispatch(updateFormSchema(formSchema))),
  });

  return connect(mapStateToProps, mapDispatchToProps)(SubmitForm);
})();


const ReduxProjectSubmission = (() => {
  const mapStateToProps = (state, ownProps) => ({
    typeList: state.submission.nodeTypes,
    dataIsReady: !!state.submission.counts_search,
    dictionary: state.submission.dictionary,
    submitForm: ReduxSubmitForm,
    submitTSV: ReduxSubmitTSV,
    dataModelGraph: ReduxDataModelGraph,
    project: ownProps.params.project,
  });

  const mapDispatchToProps = dispatch => ({
    onGetCounts: (typeList, project, dictionary) =>
      dispatch(getCounts(typeList, project, dictionary)),
  });
  return connect(mapStateToProps, mapDispatchToProps)(ProjectSubmission);
})();

export default ReduxProjectSubmission;
