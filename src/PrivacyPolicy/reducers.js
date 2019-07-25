const privacyPolicy = (state = '', action) => {
  if (action.type === 'LOAD_PRIVACY_POLICY') {
    return action.value;
  }
  return state;
};

export default privacyPolicy;
