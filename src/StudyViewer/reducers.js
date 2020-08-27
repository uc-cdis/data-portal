const study = (state = {}, action) => {
  switch (action.type) {
  case 'RECEIVE_STUDY_DATASET':
    return { ...state, dataset: action.dataset };
  case 'STUDY_DATASET_ERROR':
    return { ...state, error: action.error };
  default:
    return state;
  }
};

export default study;
