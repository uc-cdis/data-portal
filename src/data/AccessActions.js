import { fetchWrapper, fetchOAuthURL } from './actions';
import { fetchProjects }  from './queryactions';
import { cloudmiddleware_path, cloudmiddleware_oauth_path } from '../localconf';

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

export const getFromServer = (method='GET') => {
  return (dispatch, getState) => {
    let path = getState().routing.locationBeforeTransitions.pathname.split("-");
    let user = getState().user;
    let url = cloudmiddleware_path + "aws_user";
    return dispatch(
      fetchWrapper({
        path: url,
        method: method,
        body: file,
        handler: receiveSubmit
      }))
  }
};

export const loginCloudMiddleware = () => {
  // Fetch projects, if unauthorized, login
  return (dispatch, getState) => {
    return dispatch(fetchCloudAccess()).then(()=>{
      let projects = getState().user.access_key_pair;
      if (projects){
        // user already logged in
        return Promise.reject("already logged in");
      }
      else {
        return Promise.resolve()
      }
    }).then(()=>dispatch(fetchOAuthURL(cloudmiddleware_oauth_path))).then(()=>{
      let url = getState().user.oauth_url;
      return dispatch(fetchWrapper({
        path:url,
        handler:receiveMiddlewareLogin
      }))}).then(()=>dispatch(fetchCloudAccess()))
      .catch((error) => console.log(error));
  }
};

export const receiveMiddlewareLogin = ({status, data}) => {
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

export const fetchCloudAccess = () => {
  return fetchWrapper({
    path: cloudmiddleware_path + "aws_user",
    handler: receiveCloudAccess
  })
};

export const receiveCloudAccess = ({status, data}) => {
  switch (status) {
    case 200:
      return {
        type: 'RECEIVE_USER_ACCESS',
        user: data["user"],
        access_key: data["access_key"]
      };
    default:
      return {
        type: 'FETCH_ERROR',
        error: data['error']
      }
  }
};
