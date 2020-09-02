const study = (state = {}, action) => {
  switch (action.type) {
  case 'RECEIVE_STUDY_DATASET':
    return { ...state, dataset: action.dataset };
  case 'STUDY_DATASET_ERROR':
    return { ...state, error: action.error };
  case 'RECEIVE_OPEN_DOC_DATA': {
    return { ...state, docData: action.fileData };
  }
  default:
    return state;
  }
};

export default study;
