import 'babel-polyfill'

export const user_profile = (state={}, action) => {
  switch (action.type){
    case 'RECEIVE_USER_PROFILE':
      return {...state, access_key_pairs: action.access_keys};
    case 'USER_PROFILE_ERROR':
      return {...state, user_profile_error: action.error};
    case 'RECEIVE_USERAPI_LOGIN':
      return {...state, login:state.result, error:state.error};
    case 'REQUEST_DELETE_KEY':
      return {...state, ...action.user_profile, request_delete_key: action.access_key};
    case 'CREATE_SUCCEED':
      return {...state, ...action.user_profile, access_key_pair: action.access_key_pair,
        str_access_key_pair: action.str_access_key_pair, create_error: null};
    case 'CREATE_USER_SUCCEED':
      return {...state, user: action.user, create_error: null};
    case 'CREATE_FAIL':
      return {...state, create_error: action.error};
    case 'DELETE_KEY_SUCCEED':
      return {...state, ...action.user_profile, delete_error: null};
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
