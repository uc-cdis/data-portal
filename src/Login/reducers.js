/** @typedef {import('./types').LoginState} LoginState */

/** @type {import('redux').Reducer<LoginState>} */
const login = (state = /** @type {LoginState} */ ({}), action) => {
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
