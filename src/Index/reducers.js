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
    default:
      return state;
  }
};

export default index;
