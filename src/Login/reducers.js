export const login = (state = {}, action) => {
  switch (action.type) {
  case 'RECEIVE_GOOGLE_URL':
    return { ...state, google: action.url };
  default:
    return state;
  }
};

