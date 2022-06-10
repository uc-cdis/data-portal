/** @typedef {import('./types').LoginState} LoginState */

/** @type {import('redux').Reducer<LoginState>} */
const login = (state = /** @type {LoginState} */ ({}), action) => {
  switch (action.type) {
    case 'RECEIVE_LOGIN_ENDPOINT':
      return { ...state, providers: action.payload };
    case 'LOGIN_ENDPOINT_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default login;
