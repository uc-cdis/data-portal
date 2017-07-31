import { fetchWrapper, fetchOAuthURL, updatePopup } from '../actions';
import { credential_path, credential_oauth_path } from '../localconf';
import moment from 'moment';

export const loginCloudMiddleware = () => {
  // Fetch projects, if unauthorized, login
  return (dispatch, getState) => {
    return dispatch(fetchStorageAccess()).then(()=>{
      let projects = getState().cloud_access.access_key_pair;
      if (projects){
        // user already logged in
        return Promise.reject("already logged in");
      }
      else {
        return Promise.resolve()
      }
    }).then(()=>dispatch(fetchOAuthURL(credential_oauth_path))).then(()=>{
      let url = getState().user.oauth_url;
      return dispatch(fetchWrapper({
        path:url,
        handler:receiveUserAPILogin
      }))}).then(()=>dispatch(fetchStorageAccess()))
      .catch((error) => console.log(error));
  }
};

export const receiveUserAPILogin = ({status, data}) => {
  switch (status) {
    case 200:
      return {
        type: 'RECEIVE_USERAPI_LOGIN',
        result: true
      };
    default: {
      return {
        type: "RECEIVE_USERAPI_LOGIN",
        result: false,
        error: data
      }
    }
  }
};

export const fetchStorageAccess = () => {
  return fetchWrapper({
    path: credential_path,
    handler: receiveCloudAccess
  })
};

const convertTime = (value) => {
  value['create_date'] = moment(value['create_date']).format('YYYY-MM-DD HH:mm:ss');
  return value
};

const convertTimes = (values) => {
  values.map( item => {
    convertTime(item)
  });
  return values;
};

export const receiveCloudAccess = ({status, data}) => {
  switch (status) {
    case 200:
      return {
        type: 'RECEIVE_CLOUD_ACCESS',
        access_keys: data,
      };
    default:
      return {
        type: 'CLOUD_ACCESS_ERROR',
        error: data['error']
      }
  }
};

export const requestDeleteKey = (access_key) => {
  return {
    type: 'REQUEST_DELETE_KEY',
    access_key: access_key
  }
};

export const deleteKey = (access_key) => {
  let receiveDeleteKey = ({status, data}) => {
    console.log('receive delete');
    return receiveDeleteKeyResponse({status, data, access_key})
  };
  return fetchWrapper({
    path: credential_path + access_key,
    method: 'DELETE',
    handler: receiveDeleteKey
  })
};

export const receiveDeleteKeyResponse = ({status, data, access_key}) => {
  return (dispatch) => {
    switch (status) {
      case 201:
        dispatch({
          type: 'DELETE_KEY_SUCCEED',
        });
        dispatch(clearDeleteSession())
        dispatch(updatePopup({key_delete_popup: false}));
        return dispatch(fetchStorageAccess());
      default:
        return dispatch({
          type: 'DELETE_KEY_FAIL',
          access_key: access_key,
          error: data
        });
    }
  }
};

export const clearDeleteSession = () => {
  return {
    type: 'CLEAR_DELETE_KEY_SESSION'
  }
};

export const createKey = () => {
  let receiveCreatedKey = ({status, data}) => {
    console.log('receive delete');
    return receiveCreatedKeyResponse({status, data})
  };
  return fetchWrapper({
    path: credential_path,
    method: 'POST',
    handler: receiveCreatedKey
  })
};

export const parseKeyToString = (content) => {
  return 'access_key\tsecrect_key\n' + content['access_key'] + '\t' + content['secret_key'];
};

export const receiveCreatedKeyResponse = ({status, data}) => {
  return (dispatch) => {
    switch (status) {
      case 200:
        dispatch({
          type: 'CREATE_SUCCEED',
          access_key_pair: data,
          str_access_key_pair: parseKeyToString(data)
        });
        dispatch(updatePopup({save_key_popup: true}));
        return dispatch(fetchStorageAccess());
      default:
        dispatch({
          type: 'CREATE_FAIL',
          error: data['error']
        });
        return dispatch(updatePopup({save_key_popup: true}));
    }
  }
};

export const clearCreationSession = () => {
  return {
    type: 'CLEAR_CREATION_SESSION'
  }
};
