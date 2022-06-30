/** @typedef {import('./types').UserProfileState} UserProfileState */
/** @type {import('redux').Reducer<UserProfileState>} */
const userProfile = (state = /** @type {UserProfileState} */ ({}), action) => {
  switch (action.type) {
    case 'RECEIVE_USER_PROFILE':
      return { ...state, jtis: action.payload };
    case 'USER_PROFILE_ERROR':
      return { ...state, userProfile_error: action.payload };
    case 'REQUEST_DELETE_KEY':
      return {
        ...state,
        ...action.payload,
      };
    case 'CREATE_SUCCEED':
      return {
        ...state,
        ...action.payload,
        create_error: null,
      };
    case 'CREATE_FAIL':
      return { ...state, create_error: action.payload };
    case 'DELETE_KEY_SUCCEED':
      return { ...state, delete_error: null };
    case 'DELETE_KEY_FAIL':
      return { ...state, delete_error: action.payload };
    case 'CLEAR_DELETE_KEY_SESSION':
      return { ...state, delete_error: null, request_delete_key: null };
    case 'CLEAR_CREATION_SESSION':
      return {
        ...state,
        delete_error: null,
      };
    default:
      return state;
  }
};

export default userProfile;
