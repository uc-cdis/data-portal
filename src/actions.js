/** @typedef {import('redux').AnyAction} AnyAction */

/* SLICE: KUBE */
/**
 * @param {import('./types').KubeState['job']} payload
 * @returns {AnyAction}
 */
export function receiveJobDispatch(payload) {
  return {
    type: 'RECEIVE_JOB_DISPATCH',
    payload,
  };
}

/**
 * @param {Object} payload
 * @param {import('./types').KubeState['job']} payload.job
 * @param {import('./types').KubeState['resultURL']} payload.resultURL
 * @returns {AnyAction}
 */
export function receiveJobStatus(payload) {
  return {
    type: 'RECEIVE_JOB_STATUS',
    payload: { ...payload.job, resultURL: payload.resultURL },
  };
}

/**
 * @param {import('./types').KubeState['jobStatusInterval']} payload
 * @returns {AnyAction}
 */
export function setJobStatusInterval(payload) {
  return {
    type: 'JOB_STATUS_INTERVAL',
    payload,
  };
}

/** @returns {AnyAction} */
export function resetJob() {
  return {
    type: 'RESET_JOB',
  };
}

/* SLICE: POPUP */
/**
 * @param {Partial<import('./types').PopupState>} state
 * @returns {AnyAction}
 */
export const updatePopup = (state) => ({
  type: 'UPDATE_POPUP',
  payload: state,
});

/* SLICE: PROJECTS */
/** @returns {AnyAction} */
export const receiveProjects = (payload) => ({
  type: 'RECEIVE_PROJECTS',
  payload,
});

/* SLICE: STATUS */
/** @returns {AnyAction} */
export const connectionError = () => {
  console.log('connection error');
  return {
    type: 'REQUEST_ERROR',
    payload: 'connection_error',
  };
};

/* SLICE: USER */
/**
 * @param {import('./types').User} payload
 * @returns {AnyAction}
 */
export const receiveUser = (payload) => ({
  type: 'RECEIVE_USER',
  payload,
});

/**
 * @param {import('./types').UserState['fetch_error']} payload
 * @returns {AnyAction}
 */
export const fetchErrored = (payload) => ({
  type: 'FETCH_ERROR',
  payload,
});

/* SLICE: USER ACCESS */
/**
 * @param {import('./types').UserAccessState['access']} payload
 * @returns {AnyAction}
 */
export const receiveUserAccess = (payload) => ({
  type: 'RECEIVE_USER_ACCESS',
  payload,
});

/* SLICE: VERSION INFO */
/**
 * @param {import('./types').VersionInfoState['dataVersion']} payload
 * @returns {AnyAction}
 */
export const receiveDataVersion = (payload = '') => ({
  type: 'RECEIVE_DATA_VERSION',
  payload,
});
