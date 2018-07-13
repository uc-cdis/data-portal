const coreMetadata = (state = {}, action) => {
  switch (action.type) {
  case 'RECEIVE_CORE_METADATA':
    return { ...state, metadata: action.metadata };
  case 'CORE_METADATA_ERROR':
    return { ...state, metadata_error: action.error };
  default:
    return state;
  }
};

export default coreMetadata;
