import { fetchOAuthURL, fetchWrapper } from '../actions';
import { predict_file_type } from '../utils';
import { fetchProjects, fetchDictionary }  from '../queryactions';
import { submissionApiPath, submissionApiOauthPath } from '../localconf';

export const uploadTSV = (value, type) => {
  return (dispatch) => {
    dispatch( {'type': 'REQUEST_UPLOAD', 'file': value, 'file_type': type } )
  }
};

export const updateFileContent = ( value, file_type) => {
  return (dispatch) => {
    dispatch( {'type': 'UPDATE_FILE', 'file': value, 'file_type': predict_file_type(value, file_type)} );
  }
};

export const receiveSubmit = ( { status, data}) => {
  switch (status) {
    case 200:
      return {
        type: 'RECEIVE_SUBMISSION',
        submit_status: 'succeed: ' + status,
        data: data
      };
    default:
      return {
        type: 'RECEIVE_SUBMISSION',
        submit_status: 'failed: ' + status,
        data: data
      }
  }
};

export const submitToServer = (method='PUT') => {
  return (dispatch, getState) => {
    let path = getState().routing.locationBeforeTransitions.pathname.split("-");
    let program = path[0];
    let project = path.slice(1).join('-');
    let submission = getState().submission;
    if (path == 'graphql'){
      method = 'POST'
    }
    let file = submission.file;
    if (!file) {
      return Promise.reject("No file to submit")
    }
    else if (submission.file_type != 'text/tab-separated-values') {
      // remove line break in json file
      file = file.replace(/\n/g,'');
    }
    let sub_url = submissionApiPath;
    if (program != '_root'){
      sub_url = sub_url + program + '/' + project + '/';
    }
    return dispatch(
      fetchWrapper({
        path: sub_url,
        method: method,
        custom_headers: {'Content-Type': submission.file_type},
        body: file,
        handler: receiveSubmit
      }))
  }
};

export const setProject = (project) => {
  return {
    type: 'SET_PROJECT',
    project: project
  }
};

let lastProjectFetchMs = 0;

export const loginSubmissionAPI = () => {
  // Fetch projects, if unauthorized, login
  return (dispatch, getState) => {
    { // If already have fresh data, then exit
      const state = getState();
      if ( state.submission && state.submission.projects && lastProjectFetchMs + 30000 > Date.now() ) {
        return Promise.resolve();
      }
      lastProjectFetchMs = Date.now();
    }

    return dispatch(
      fetchDictionary()
    ).then(() =>
      dispatch(fetchProjects())
    ).then(()=>{
      //
      // I think the assumption here is that fetchProjects either succeeds or fails.
      // If it fails, then we won't have any project data, and we'll go on
      // to fetchOAuthURL bla bla ..
      //
      const projects = getState().submission.projects;
      if (projects){
        // user already logged in
        return Promise.reject("already logged in");
      }
      else {
        return Promise.resolve()
      }
    }).then(()=>dispatch(fetchOAuthURL(submissionApiOauthPath))).then(()=>{
        let url = getState().submission.oauth_url;
        return dispatch(fetchWrapper({
          path:url,
          handler:receiveSubmissionLogin
        }))
      }
    ).then(
      // why are we doing this again ?
      ()=>dispatch(fetchProjects()))
    .catch((error) => console.log(error));
  }
};

export const receiveSubmissionLogin = ({status, data}) => {
  switch (status) {
    case 200:
      return {
        type: 'RECEIVE_SUBMISSION_LOGIN',
        result: true
      };
    default: {
      return {
        type: "RECEIVE_SUBMISSION_LOGIN",
        result: false,
        error: data
      }
    }
  }
};
