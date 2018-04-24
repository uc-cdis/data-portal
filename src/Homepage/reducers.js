const homepage = (state = {}, action) => {
  switch (action.type) {
  case 'RECEIVE_PROJECT_LIST': {
    //
    // Note - save projectsByName, b/c we acquire more data for individual projects
    // over time
    //
    const projectsByName = Object.assign({}, state.projectsByName || {});
    action.data.projectList.forEach((proj) => {
      const old = projectsByName[proj.name] || {};
      projectsByName[proj.name] = Object.assign(old, proj);
    });
    const summaryCounts = Object.assign({}, state.summaryCounts || {}, action.data.summaryCounts);
    // const { error, ...state } = state;
    return { ...state, projectsByName, summaryCounts };
  }
  case 'RECEIVE_PROJECT_DETAIL': {
    const projectsByName = Object.assign({}, state.projectsByName || {});
    projectsByName[action.data.name] = action.data;
    return { ...state, projectsByName };
  }
  case 'RECEIVE_PROJECT_FAIL': {
    return { ...state, error: action.data.error };
  }
  default:
    return state;
  }
};

export default homepage;
