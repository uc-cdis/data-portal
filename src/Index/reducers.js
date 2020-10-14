const index = (state = {}, action) => {
  switch (action.type) {
    case 'RECEIVE_INDEX_PAGE_COUNTS': {
      const { names, count_total, ...counts } = action.data;

      const projectsByName = {};
      for (const [key, count] of Object.entries(counts)) {
        const index = parseInt(key.split('_')[1]) - 1;
        const name = names[index];
        projectsByName[name] = { code: name, counts: [count], name };
      }

      return {
        ...state,
        projectsByName,
        summaryCounts: { 0: count_total },
        updatedAt: Date.now(),
        countNames: ['Subjects'],
      };
    }
    case 'RECEIVE_INDEX_PAGE_OVERVIEW_COUNTS': {
      const { names, counts_total, ...counts } = action.data;

      const total = {};
      for (const val of counts_total)
        for (const count of Object.keys(val)) {
          if (total.hasOwnProperty(count)) total[count] += val[count];
          else total[count] = val[count];
        }

      const byConsortium = {};
      for (const [key, vals] of Object.entries(counts)) {
        const index = parseInt(key.split('_')[1]) - 1;
        const name = names[index];

        byConsortium[name] = {};
        for (const val of vals)
          for (const count of Object.keys(val)) {
            if (byConsortium[name].hasOwnProperty(count))
              byConsortium[name][count] += val[count];
            else byConsortium[name][count] = val[count];
          }
      }

      return {
        ...state,
        overviewCounts: { ...byConsortium, total, updatedAt: Date.now() },
      };
    }
    default:
      return state;
  }
};

export default index;
