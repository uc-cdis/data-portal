const certificate = (state = {}, action) => {
  switch (action.type) {
  case 'UPDATE_CERTIFICATE_FORM':
    return { ...state, certificate_result: action.data };
  case 'RECEIVE_CERT_SUBMIT':
    return { ...state };
  default:
    return state;
  }
};

export default certificate;
