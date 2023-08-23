export const bar = (state = {}, action) => {
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

export const banner = (state = {}, action) => {
  switch (action.type) {
  case 'RESET_BANNER': {
    const closedBanners = state?.closedBanners?.[action.data.id];
    delete closedBanners?.[action.data.id];
    return { ...state, closedBanners };
  }
  case 'CLOSE_BANNER': {
    return {
      ...state,
      closedBanners: {
        ...state?.closedBanners,
        [action.data.id]: action.data.resetDate,
      },
    };
  }
  default:
    return state;
  }
};
