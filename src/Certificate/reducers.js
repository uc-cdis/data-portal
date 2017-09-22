export const certificate = (state = {}, action) => {
  switch (action.type) {
  case 'UPDATE_CERTIFICATE_FORM':
    return { ...state, certificate_result: action.data };
  default:
    return state;
  }
};
