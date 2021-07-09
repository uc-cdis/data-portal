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
  case 'RESET_JOB':
    return {
      ...state, job: null, jobStatusInterval: null, resultURL: null,
    };
  case 'RECEIVE_MARINER_JOB_STATUS':
    return { ...state, marinerJobStatus: action.marinerJobStatus };
  case 'RECEIVE_WSS_FILE_LIST':
    return { ...state, wssFileObjects: action.wssFileObjects, wssFilePrefix: action.wssFilePrefix };
  case 'WSS_LIST_FILE_ERROR':
    return { ...state, wssListFileError: action.error };
  case 'RECEIVE_WSS_FILE':
    return { ...state, wssFileData: action.wssFileData };
  case 'WSS_FILE_DOWNLOAD_URL_ERROR':
    return { ...state, wssDownloadFileError: action.error };
  default:
    return state;
  }
};

export default analysis;
