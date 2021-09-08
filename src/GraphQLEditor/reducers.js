const graphiql = (state = {}, action) => {
  switch (action.type) {
    case 'RECEIVE_SCHEMA':
      return { ...state, schema: action.schema };
    case 'RECEIVE_SCHEMA_FLAT':
      return { ...state, schemaFlat: action.data };
    default:
      return state;
  }
};

export default graphiql;
