const index = (state = {}, action) => {
  switch (action.type) {
    case 'RECEIVE_INDEX_PAGE_COUNTS': {
      const { names, count_total, ...counts } = action.data;

      const projectsByName = {};
      for (const [key, count] of Object.entries(counts)) {
        const index = parseInt(key.split('_')[1]);
        const name = names[index];
        projectsByName[name] = { code: name, counts: [count], name };
      }

      return {
        ...state,
        projectsByName,
        summaryCounts: { 0: count_total },
        lastestListUpdating: Date.now(),
        countNames: ['Subjects'],
      };
    }
    case 'RECEIVE_INDEX_PAGE_CHART_DATASETS': {
      const { projectNodeCounts, homepageChartNodes } = action;
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
          counts = nodesForIndexChart.map(
            (node) => projectNodeCounts[proj][node]
          );
        }

        projectsByName[proj] = {
          code,
          counts,
          name: proj,
        };
      });

      const countNames = homepageChartNodes.map((item) => item.name);

      return { ...state, projectsByName, countNames };
    }
    case 'RECEIVE_INDEX_PAGE_CHART_PROJECT_LIST': {
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
        {},
        state.summaryCounts || {},
        action.data.summaryCounts
      );
      const lastestListUpdating = Date.now();
      // const { error, ...state } = state;
      return {
        ...state,
        projectsByName,
        summaryCounts,
        lastestListUpdating,
        countNames: ['Persons', 'Subjects'],
      };
    }
    case 'RECEIVE_INDEX_PAGE_CHART_PROJECT_DETAIL': {
      const projectsByName = Object.assign({}, state.projectsByName || {});
      projectsByName[action.data.name] = action.data;
      const lastestDetailsUpdating = Date.now();
      return { ...state, projectsByName, lastestDetailsUpdating };
    }
    default:
      return state;
  }
};

export default index;
