const covid19Dashboard = (state = {}, action) => {
  switch (action.type) {
  case 'RECEIVE_DASHBOARD_DATA': {
    const res = {};
    res[action.name] = action.contents;
    return { ...state, ...res };
  }
  default:
    return state;
  }
};

export default covid19Dashboard;
