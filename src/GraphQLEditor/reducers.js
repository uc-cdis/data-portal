export const parameters = (state={}, action) => {
  switch (action.type) {
    case 'UPDATE_QUERY':
      return {...state, query:action.query};
    case 'UPDATE_VARIABLES':
      return {...state, variables:action.variables};
    default:
      return state;
  }
};

