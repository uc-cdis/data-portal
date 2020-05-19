const covid19Dashboard = (state = {}, action) => {
  switch (action.type) {
  case 'RECEIVE_DASHBOARD_DATA': {
    const res = {};
    res[action.name] = action.contents;
    return { ...state, ...res };
  }
  case 'RECEIVE_TIME_SERIES_DATA': {
    return {
      ...state,
      selectedLocationData: { data: action.contents, title: action.title },
    };
  }
  case 'CLOSE_TIME_SERIES_POPUP': {
    return { ...state, selectedLocationData: null };
  }
  default:
    return state;
  }
};

export default covid19Dashboard;
