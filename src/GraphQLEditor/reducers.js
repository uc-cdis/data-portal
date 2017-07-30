export const parameters = (state={}, action) => {
  switch (action.type) {
    case 'UPDATE_QUERY':
      return {...state, query:action.query};
    case 'UPDATE_VARIABLES':
      return {...state, variables:action.variables};
    case 'RECEIVE_COUNTS':
      let links = {};
      for (var key in action.data) {
        if (!key.startsWith("_")) {
          links[key] = action.data[key].length
        }
      }
      return { ...state, counts_search: action.data, links_search: links};
    case 'CLEAR_COUNTS':
      return { ...state, counts_search: null};
    default:
      return state;
  }
};

