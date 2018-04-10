import { connect } from 'react-redux';
import ProjectSubmission from './ProjectSubmission';
import SubmitTSV from './SubmitTSV';
import SubmitForm from './SubmitForm';

import ReduxDataModelGraph, { getCounts } from '../DataModelGraph/ReduxDataModelGraph';

import { fetchWithCreds } from '../actions';
import { predictFileType } from '../utils';
import { submissionApiPath } from '../localconf';

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
  const path = fullProject.split('-');
  const program = path[0];
  const project = path.slice(1).join('-');
  const submission = getState().submission;
  const method = path === 'graphql' ? 'POST' : methodIn;
  let file = submission.file;
  if (!file) {
    return Promise.reject('No file to submit');
  } else if (submission.file_type !== 'text/tab-separated-values') {
    // remove line break in json file
    file = file.replace(/\n/g, '');
  }
  let subUrl = submissionApiPath;
  if (program !== '_root') {
    subUrl = `${subUrl + program}/${project}/`;
  }
  return fetchWithCreds({
    path: subUrl,
    method,
    customHeaders: { 'Content-Type': submission.file_type },
    body: file,
    dispatch,
  }).then(
    ({ status, data }) => (
      {
        type: 'RECEIVE_SUBMISSION',
        submit_status: status,
        data,
      }),
  ).then(msg => dispatch(msg));
};

const ReduxSubmitTSV = (() => {
  const mapStateToProps = state => ({
    submission: state.submission,
    dictionary: state.dictionary,
  });

  const mapDispatchToProps = dispatch => ({
    onUploadClick: (value, type) => dispatch(uploadTSV(value, type)),
    onSubmitClick: (type, project, dictionary) =>
      dispatch(submitToServer(project))
        .then(
          () => {
            // Update node countItems in redux
            dispatch(getCounts(type, project, dictionary));
          }),
    onFileChange: value => dispatch(updateFileContent(value)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(SubmitTSV);
})();


const ReduxSubmitForm = (() => {
  const mapStateToProps = state => ({
    submission: state.submission,
  });

  const matpDispatchToProps = dispatch => ({
    onUploadClick: (value, type) => dispatch(uploadTSV(value, type)),
    onUpdateFormSchema: (formSchema => dispatch(updateFormSchema(formSchema))),
  });

  return connect(mapStateToProps, matpDispatchToProps)(SubmitForm);
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
