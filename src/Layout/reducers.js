const bar = (state = {}, action) => {
  switch (action.type) {
  case 'ACTIVE_CHANGED': {
    return { ...state, active: action.data };
  }
  default:
    // Keep active in sync with URL for navigation updates outside of NavBar
    if (state.active === window.location.pathname) {
      return state;
    }
    return { ...state, active: window.location.pathname };
  }
};

export default bar;
