import 'babel-polyfill'

export const cloud_access = (state={}, action) => {
  switch (action.type){
    case 'RECEIVE_CLOUD_ACCESS':
      return {...state, access_key_pairs: action.access_keys};
    case 'CLOUD_ACCESS_ERROR':
      return {...state, cloud_access_error: action.error};
    case 'RECEIVE_USERAPI_LOGIN':
      return {...state, login:state.result, error:state.error};
    case 'REQUEST_DELETE_KEY':
      return {...state, ...action.cloud_access, request_delete_key: action.access_key};
    case 'CREATE_SUCCEED':
      return {...state, ...action.cloud_access, access_key_pair: action.access_key_pair,
        str_access_key_pair: action.str_access_key_pair, create_error: null};
    case 'CREATE_USER_SUCCEED':
      return {...state, user: action.user, create_error: null};
    case 'CREATE_FAIL':
      return {...state, create_error: action.error};
    case 'DELETE_KEY_SUCCEED':
      return {...state, ...action.cloud_access, delete_error: null};
    case 'DELETE_KEY_FAIL':
      return {...state, delete_error: action.error};
    case 'CLEAR_DELETE_KEY_SESSION':
      return {...state, delete_error: null, request_delete_key: null};
    case 'CLEAR_CREATION_SESSION':
      return {...state, access_key_pair: null, str_access_key_pair: null, delete_error: null};
    case 'FETCH_ERROR':
      return {...state, fetch_error: action.error};
    default:
      return state
  }
};
