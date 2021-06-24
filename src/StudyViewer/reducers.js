const study = (state = {}, action) => {
  switch (action.type) {
  case 'RECEIVE_STUDY_DATASET_LIST':
    return { ...state, datasets: action.datasets };
  case 'RECEIVE_SINGLE_STUDY_DATASET':
    return { ...state, dataset: action.datasets[0] };
  case 'STUDY_DATASET_ERROR':
    return {
      ...state, error: action.error, dataset: {}, datasets: [],
    };
  case 'RECEIVE_OPEN_DOC_DATA':
    return { ...state, docData: action.fileData };
  case 'RECEIVE_OBJECT_FILE_DATA':
    return { ...state, fileData: action.fileData };
  case 'FILE_DATA_ERROR':
    return { ...state, fileError: action.error };
  case 'NO_CONFIG_ERROR':
    return { ...state, noConfigError: action.error };
  case 'RESET_SINGLE_STUDY_DATA':
    return { ...state, dataset: undefined };
  case 'RESET_MULTIPLE_STUDY_DATA':
    return { ...state, datasets: undefined };
  default:
    return state;
  }
};

export default study;
