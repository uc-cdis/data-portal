const covid19Dashboard = (state = {}, action) => {
  switch (action.type) {
  case 'RECEIVE_CHART_DATA': {
    // console.log("Received chart data for", action.name)
    let res = state;
    res[action.name] = action.contents;
    return res;
  }
  default:
    return state;
  }
};

export default covid19Dashboard;
