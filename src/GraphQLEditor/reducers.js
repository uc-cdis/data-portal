/** @type {import('redux').Reducer} */
const graphiql = (state = {}, action) => {
  switch (action.type) {
    case 'RECEIVE_SCHEMA':
      return { ...state, schema: action.schema };
    case 'RECEIVE_GUPPY_SCHEMA':
      return { ...state, guppySchema: action.data };
    default:
      return state;
  }
};

export default graphiql;
