const bar = (state = {}, action) => {
  switch (action.type) {
  case 'ACTIVE_INIT': {
    return { ...state, active: window.location.pathname };
  }
  case 'ACTIVE_CHANGED': {
    return { ...state, active: action.data };
  }
  default:
    return state;
  }
};

export default bar;
