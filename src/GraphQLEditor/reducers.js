/** @typedef {import('./types').GraphiqlState} GraphiqlState */
/** @type {import('redux').Reducer<GraphiqlState>} */
const graphiql = (state = /** @type {GraphiqlState} */ ({}), action) => {
  switch (action.type) {
    case 'RECEIVE_GUPPY_SCHEMA':
      return { ...state, guppySchema: action.payload };
    case 'RECEIVE_SCHEMA':
      return { ...state, schema: action.payload };
    default:
      return state;
  }
};

export default graphiql;
