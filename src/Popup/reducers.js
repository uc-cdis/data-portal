const popups = (state = {}, action) => {
  switch (action.type) {
  case 'UPDATE_POPUP':
    return { ...state, ...action.data };
  case 'UPDATE_WORKSPACE_ALERT':
    return { ...state, ...action.data };
  default:
    return state;
  }
};

export default popups;
