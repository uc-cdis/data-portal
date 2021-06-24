import { components } from '../params';

const index = (state = {}, action) => {
  switch (action.type) {
  case 'RECEIVE_HOMEPAGE_CHART_DATASETS': {
    const { projectNodeCounts, homepageChartNodes, fileNodes } = action;
    const nodesForIndexChart = homepageChartNodes.map((item) => item.node);

    // constructing projct counts for index bar chart
    const projectsByName = {};
    Object.keys(projectNodeCounts).forEach((proj) => {
      let code = proj;
      const projCodeIndex = proj.indexOf('-');
      if (projCodeIndex !== -1) {
        code = proj.substring(projCodeIndex + 1);
      }
      let counts = 0;
      if (projectNodeCounts[proj]) {
        counts = nodesForIndexChart.map((node) => projectNodeCounts[proj][node]);
      }

      if (nodesForIndexChart.length < 4) {
        const fileCountsForProj = fileNodes.reduce((acc, fileNode) => {
          let newAcc = acc;
          if (projectNodeCounts[proj][fileNode]) {
            newAcc += projectNodeCounts[proj][fileNode];
          }
          return newAcc;
        }, 0);
        counts.push(fileCountsForProj);
      }

      projectsByName[proj] = {
        code,
        counts,
        name: proj,
      };
    });

    const countNames = homepageChartNodes.map((item) => item.name);
    if (countNames.length < 4) {
      countNames.push('Files');
    }
    return { ...state, projectsByName, countNames };
  }
  case 'RECEIVE_HOMEPAGE_CHART_PROJECT_LIST': {
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
  case 'RECEIVE_HOMEPAGE_CHART_PROJECT_DETAIL': {
    const projectsByName = { ...state.projectsByName || {} };
    projectsByName[action.data.name] = action.data;
    const lastestDetailsUpdating = Date.now();
    return { ...state, projectsByName, lastestDetailsUpdating };
  }
  default:
    return state;
  }
};

export default index;
