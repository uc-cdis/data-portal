const login = (state = {}, action) => {
  switch (action.type) {
  case 'RECEIVE_LOGIN_ENDPOINT':
    return { ...state, providers: action.providers };
  case 'LOGIN_ENDPOINT_ERROR':
    return { ...state, error: action.error };
  default:
    return state;
  }
};

export default login;
