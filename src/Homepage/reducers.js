import { components } from '../params';

const homepage = (state = {}, action) => {
  switch (action.type) {
  case 'RECEIVE_PROJECT_LIST': {
    //
    // Note - save projectsByName, b/c we acquire more data for individual tables
    // over time
    //
    const projectsByName = Object.assign({}, state.projectsByName || {});
    action.data.projectList.forEach((proj) => {
      const old = projectsByName[proj.name] || {};
      projectsByName[proj.name] = Object.assign(old, proj);
    });
    const summaryCounts = Object.assign(
      {}, state.summaryCounts || {}, action.data.summaryCounts,
    );
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
    const projectsByName = Object.assign({}, state.projectsByName || {});
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
  case 'RECEIVE_PROJECT_NODE_DATASETS': {
    const { projectNodeCounts, homepageChartNodes, fileNodes } = action;
    const nodesForIndexChart = homepageChartNodes.map(item => item.node);

    // adding counts by node
    const summaryCounts = nodesForIndexChart.reduce((acc, curNode, index) => {
      Object.keys(projectNodeCounts).forEach((proj) => {
        if (projectNodeCounts[proj][curNode]) {
          acc[index] += projectNodeCounts[proj][curNode];
        }
      });
      return acc;
    }, nodesForIndexChart.map(() => 0));

    // keep previous design: if less than 4 nodes, calculate all files number
    if (nodesForIndexChart.length < 4) {
      // add counts for all file type nodes, as the last count
      const fileCount = fileNodes.reduce((acc, fileNode) => {
        let newAcc = acc;
        Object.keys(projectNodeCounts).forEach((proj) => {
          if (projectNodeCounts[proj][fileNode]) {
            newAcc += projectNodeCounts[proj][fileNode];
          }
        });
        return newAcc;
      }, 0);
      summaryCounts.push(fileCount);
    }

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
        counts = nodesForIndexChart.map(node => projectNodeCounts[proj][node]);
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

    const countNames = homepageChartNodes.map(item => item.name);
    if (countNames.length < 4) {
      countNames.push('Files');
    }
    return { ...state, projectsByName, summaryCounts, countNames };
  }
  default:
    return state;
  }
};

export default homepage;
