const coreMetadata = (state = {}, action) => {
  switch (action.type) {
  case 'RECEIVE_CORE_METADATA':
    return { ...state, metadata: action.metadata };
  case 'CORE_METADATA_ERROR':
    return { ...state, error: action.error };
  case 'DOWNLOAD_FILE':
    return { ...state, file: action.data };
  case 'DOWNLOAD_FILE_ERROR':
    return { ...state, error: action.error };
  default:
    return state;
  }
};

export default coreMetadata;
