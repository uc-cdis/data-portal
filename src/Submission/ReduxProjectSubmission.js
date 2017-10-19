import { connect } from 'react-redux';
import ProjectSubmission from './ProjectSubmission';
import SubmitTSV from './SubmitTSV';
import SubmitForm from './SubmitForm';

import ReduxDataModelGraph, { getCounts } from '../DataModelGraph/ReduxDataModelGraph';

import { fetchJsonOrText, fetchOAuthURL } from '../actions';
import { predictFileType } from '../utils';
import { fetchProjects, fetchDictionary } from '../queryactions';
import { submissionApiPath, submissionApiOauthPath } from '../localconf';

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


const submitToServer = (methodIn = 'PUT') => (dispatch, getState) => {
  const path = getState().routing.locationBeforeTransitions.pathname.split('-');
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
  return fetchJsonOrText({
    path: subUrl,
    method,
    customHeaders: { 'Content-Type': submission.file_type },
    body: file,
    dispatch,
  }).then(
    ({ status, data }) => {
      switch (status) {
      case 200:
        return {
          type: 'RECEIVE_SUBMISSION',
          submit_status: `succeed: ${status}`,
          data,
        };
      default:
        return {
          type: 'RECEIVE_SUBMISSION',
          submit_status: `failed: ${status}`,
          data,
        };
      }
    },
  ).then(msg => dispatch(msg));
};


let lastProjectFetchMs = 0;

export const loginSubmissionAPI = () =>
  // Fetch projects, if unauthorized, login
  (dispatch, getState) => {
    { // If already have fresh data, then exit
      const state = getState();
      if (state.submission && state.submission.projects
        && lastProjectFetchMs + 30000 > Date.now()
      ) {
        return Promise.resolve();
      }
      lastProjectFetchMs = Date.now();
    }

    return dispatch(
      fetchDictionary(),
    ).then(() =>
      dispatch(fetchProjects()),
    ).then(() => {
      //
      // I think the assumption here is that fetchProjects either succeeds or fails.
      // If it fails, then we won't have any project data, and we'll go on
      // to fetchOAuthURL bla bla ..
      //
      const projects = getState().submission.projects;
      if (projects) {
        // user already logged in
        return Promise.reject('already logged in');
      }

      return Promise.resolve();
    })
      .then(() => dispatch(fetchOAuthURL(submissionApiOauthPath)))
      .then(oauthUrl => fetchJsonOrText({ path: oauthUrl, dispatch }))
      .then(
        ({ status, data }) => {
          switch (status) {
          case 200:
            return {
              type: 'RECEIVE_SUBMISSION_LOGIN',
              result: true,
            };
          default: {
            return {
              type: 'RECEIVE_SUBMISSION_LOGIN',
              result: false,
              error: data,
            };
          }
          }
        },
      )
      .then(
        msg => dispatch(msg),
      )
      .then(
        // why are we doing this again ?
        () => dispatch(fetchProjects()))
      .catch(error => console.log(error));
  }
;


const ReduxSubmitTSV = (() => {
  const mapStateToProps = state => ({
    submission: state.submission,
    dictionary: state.dictionary,
  });

  const mapDispatchToProps = dispatch => ({
    onUploadClick: (value, type) => dispatch(uploadTSV(value, type)),
    onSubmitClick: (type, project, dictionary) =>
      dispatch(submitToServer())
        .then(() => { dispatch(getCounts(type, project, dictionary)); }),
    // To re-render the graph when new data is submitted, need to change the 
    // counts that are stored in the state. A call to getCounts is made
    // after the data is submitted to the database to query the database for
    // the updated count info
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
  const mapStateToProps = state => ({
    typeList: state.submission.nodeTypes,
    dataIsReady: !!state.submission.counts_search,
    dictionary: state.submission.dictionary,
    submitForm: ReduxSubmitForm,
    submitTSV: ReduxSubmitTSV,
    dataModelGraph: ReduxDataModelGraph,
  });

  const mapDispatchToProps = dispatch => ({
    onGetCounts: (typeList, project, dictionary) =>
      dispatch(getCounts(typeList, project, dictionary)),
  });
  return connect(mapStateToProps, mapDispatchToProps)(ProjectSubmission);
})();

export default ReduxProjectSubmission;
