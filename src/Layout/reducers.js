const bar = (state = {}, action) => {
  switch (action.type) {
  case 'ACTIVE_CHANGED': {
    return { ...state, active: action.data };
  }
  default:
    return { ...state, active: window.location.pathname };
  }
};

export default bar;
