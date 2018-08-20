const analysis = (state = {}, action) => {
  switch (action.type) {
  case 'RECEIVE_JOB_DISPATCH':
    return { ...state, job: action.data };
  case 'RECEIVE_JOB_STATUS': {
    const job = { ...action.data, resultURL: action.resultURL };
    return { ...state, job };
  }
  case 'JOB_STATUS_INTERVAL':
    return { ...state, jobStatusInterval: action.value };
  default:
    return state;
  }
};

export default analysis;
