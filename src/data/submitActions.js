import { fetchWrapper } from './actions';
import { fetchProjects }  from './queryactions';
import { submissionapi_path, submissionapi_oauth_path } from '../localconf';
import { readFile } from '../utils';


export const uploadTSV = (value, type) => {
  return (dispatch) => {
    dispatch( {'type': 'REQUEST_UPLOAD', 'file': value, 'file_type': type } )
  }
}
export const receiveSubmit = ( { status, data}) => {
  switch (status) {
    case 200:
      return {
        type: 'RECEIVE_SUBMISSION',
        submit_status: 'succeed: ' + status,
        data: data
      }
    default:
      return {
        type: 'RECEIVE_SUBMISSION',
        submit_status: 'failed: ' + status,
        data: data
      }
  }
}

export const submitToServer = (method='PUT') => {
  return (dispatch, getState) => {
    let path = getState().routing.locationBeforeTransitions.pathname.split("-");
    let program = path[0];
    let project = path.slice(1).join('-');
    let submission = getState().submission;
    if (path == 'graphql'){
      method = 'POST'
    }
    if (!submission.file) {
      return Promise.reject("No file to submit")
    }
    return dispatch(
      fetchWrapper({
        path: submissionapi_path + program + '/' + project + '/',
        method: method,
        custom_headers: {'Content-Type': submission.file_type},
        body: submission.file,
        handler: receiveSubmit
      }))
  }
}

export const fetchOAuthURL = () => {
// Get cloud_middleware's authorization url
  console.log('fetch url')
  return fetchWrapper({
    path: submissionapi_oauth_path + "authorization_url",
    handler: receiveAuthorizationUrl
  })
}

export const loginSubmissionAPI = () => {
  // Fetch projects, if unauthorized, login
  return (dispatch, getState) => {
    return dispatch(fetchProjects()).then(()=>{
      console.log(getState())
      let projects = getState().submission.projects;
      if (projects){
        // user already logged in
        return Promise.reject("already logged in");
      }
      else {
        return Promise.resolve()
      }
    }).then(()=>dispatch(fetchOAuthURL())).then(()=>{
        let url = getState().submission.oauth_url;
        return dispatch(fetchWrapper({
          path:url,
          handler:receiveSubmissionLogin
        }))}).then(()=>dispatch(fetchProjects()))
    .catch((error) => console.log(error));
  }
}

export const receiveSubmissionLogin = ({status, data}) => {
  switch (status) {
    case 200:
      return {
        type: 'RECEIVE_SUBMISSION_LOGIN',
        result: true
      }
    default: {
      return {
        type: "RECEIVE_SUBMISSION_LOGIN",
        result: false,
        error: data
      }
    }
  }
}

export const receiveAuthorizationUrl = ({status, data}) => {
  switch (status) {
    case 200:
      return {
        type: 'RECEIVE_AUTHORIZATION_URL',
        url: data
      }
    default:
      return {
        type: 'FETCH_ERROR',
        error: data['error']
      }
  }
}

