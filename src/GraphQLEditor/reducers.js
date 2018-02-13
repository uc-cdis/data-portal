const graphiql = (state = {}, action) => {
  switch (action.type) {
  case 'RECEIVE_SCHEMA_LOGIN':
    return { ...state, schema: action.schema };
  default:
    return state;
  }
};

export default graphiql;
