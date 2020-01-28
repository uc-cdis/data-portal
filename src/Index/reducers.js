
const index = (state = {}, action) => {
  switch (action.type) {
  case 'RECEIVE_PROJECT_NODE_DATASETS': {
    const { projectNodeCounts, homepageChartNodes, fileNodes } = action;
    const nodesForIndexChart = homepageChartNodes.map(item => item.node);

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
    return { ...state, projectsByName, countNames };
  }
  default:
    return state;
  }
};

export default index;
