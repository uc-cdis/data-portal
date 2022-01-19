/** @typedef {import('./types').GraphiqlState} GraphiqlState */
/** @type {import('redux').Reducer<GraphiqlState>} */
const graphiql = (state = /** @type {GraphiqlState} */ ({}), action) => {
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
