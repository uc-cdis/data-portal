import { fetchWrapper, fetchOAuthURL } from './actions';
import { fetchProjects }  from './queryactions';
import { cloudmiddleware_path, cloudmiddleware_oauth_path } from '../localconf';
import moment from 'moment';

export const loginCloudMiddleware = () => {
  // Fetch projects, if unauthorized, login
  return (dispatch, getState) => {
    return dispatch(fetchCloudAccess()).then(()=>{
      let projects = getState().cloud_access.access_key_pair;
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
        type: 'RECEIVE_MIDDLEWARE_LOGIN',
        result: true
      };
    default: {
      return {
        type: "RECEIVE_MIDDLEWARE_LOGIN",
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


export const deleteAccessKey = (access_key_id) => {
  let receiveDeleteKey = ({status, data}) => {
    console.log('receive delete');
    return receiveDeleteResponse({status, data, id, project})
  };
  return fetchWrapper({
    path: cloudmiddleware_path + '/access_key',
    method: 'DELETE',
    handler: receiveDeleteKey
  })
};

export const receiveDeleteResponse = ({status, data}) => {
  return (dispatch) => {
    switch (status) {
      case 200:
        dispatch({
          type: 'DELETE_SUCCEED',
          id: id
        });
        dispatch(updatePopup({nodedelete_popup: false}));
        return dispatch(clearDeleteSession());

      default:
        return dispatch({
          type: 'DELETE_FAIL',
          id: id,
          error: data
        });
    }
  }
};

export const clearDeleteSession = () => {
  return {
    type: 'CLEAR_DELETE_SESSION'
  }
};

const convertTimes = (values) => {
  values.map( item => {
    item['create_date'] = moment(item['create_date']).format('YYYY-MM-DD HH:mm:ss');
  });
  return values;
};

export const receiveCloudAccess = ({status, data}) => {
  switch (status) {
    case 200:
      return {
        type: 'RECEIVE_CLOUD_ACCESS',
        cloud_access: data["user"],
        access_keys: convertTimes(data["access_key"])
      };
    default:
      return {
        type: 'FETCH_ERROR',
        error: data['error']
      }
  }
};
