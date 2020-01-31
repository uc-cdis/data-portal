const userProfile = (state = {}, action) => {
  switch (action.type) {
  case 'RECEIVE_USER_PROFILE':
    return { ...state, jtis: action.jtis };
  case 'USER_PROFILE_ERROR':
    return { ...state, userProfile_error: action.error };
  case 'RECEIVE_USERAPI_LOGIN':
    return { ...state, login: state.result, error: state.error };
  case 'REQUEST_DELETE_KEY':
    return { ...state,
      ...action.userProfile,
      requestDeleteJTI: action.jti,
      requestDeleteExp: action.exp };
  case 'CREATE_SUCCEED':
    return { ...state,
      ...action.userProfile,
      refreshCred: action.refreshCred,
      strRefreshCred: action.strRefreshCred,
      create_error: null,
    };
  case 'CREATE_USER_SUCCEED':
    return { ...state, user: action.user, create_error: null };
  case 'CREATE_FAIL':
    return { ...state, create_error: action.error };
  case 'DELETE_KEY_SUCCEED':
    return { ...state, ...action.userProfile, delete_error: null };
  case 'DELETE_KEY_FAIL':
    return { ...state, delete_error: action.error };
  case 'CLEAR_DELETE_KEY_SESSION':
    return { ...state, delete_error: null, request_delete_key: null };
  case 'CLEAR_CREATION_SESSION':
    return { ...state, access_key_pair: null, str_access_key_pair: null, delete_error: null };
  case 'FETCH_ERROR':
    return { ...state, fetch_error: action.error };
  default:
    return state;
  }
};

export default userProfile;
