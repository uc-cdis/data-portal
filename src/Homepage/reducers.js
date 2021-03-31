import { components } from '../params';

const homepage = (state = {}, action) => {
  switch (action.type) {
  case 'RECEIVE_PROJECT_LIST': {
    //
    // Note - save projectsByName, b/c we acquire more data for individual tables
    // over time
    //
    const projectsByName = { ...state.projectsByName || {} };
    action.data.projectList.forEach((proj) => {
      const old = projectsByName[proj.name] || {};
      projectsByName[proj.name] = Object.assign(old, proj);
    });
    const summaryCounts = {
      ...state.summaryCounts || {}, ...action.data.summaryCounts,
    };
    const lastestListUpdating = Date.now();
    // const { error, ...state } = state;
    return {
      ...state,
      projectsByName,
      summaryCounts,
      lastestListUpdating,
      countNames: components.charts.indexChartNames,
    };
  }
  case 'RECEIVE_PROJECT_DETAIL': {
    const projectsByName = { ...state.projectsByName || {} };
    projectsByName[action.data.name] = action.data;
    const lastestDetailsUpdating = Date.now();
    return { ...state, projectsByName, lastestDetailsUpdating };
  }
  case 'RECEIVE_TRANSACTION_LIST': {
    return { ...state, transactions: action.data };
  }
  case 'RECEIVE_RELAY_FAIL': {
    return { ...state, error: action.data };
  }
  default:
    return state;
  }
};

export default homepage;
