/** @typedef {import('redux').AnyAction} AnyAction */
/** @typedef {import('./types').UserProfileState} UserProfileState */

/**
 * @param {UserProfileState['jtis']} payload
 * @returns {AnyAction}
 */
export function receiveUserProfile(payload) {
  return {
    type: 'RECEIVE_USER_PROFILE',
    payload,
  };
}

/**
 * @param {UserProfileState['userProfile_error']} payload
 * @returns {AnyAction}
 */
export function userProfileErrored(payload) {
  return {
    type: 'USER_PROFILE_ERROR',
    payload,
  };
}

/**
 * @param {Object} payload
 * @param {UserProfileState['requestDeleteJTI']} payload.requestDeleteJTI
 * @param {UserProfileState['requestDeleteExp']} payload.requestDeleteExp
 * @returns {AnyAction}
 */
export function requestDeleteKey(payload) {
  return {
    type: 'REQUEST_DELETE_KEY',
    payload,
  };
}

/**
 * @param {Object} payload
 * @param {UserProfileState['refreshCred']} payload.refreshCred
 * @param {UserProfileState['strRefreshCred']} payload.strRefreshCred
 * @returns {AnyAction}
 */
export function createSucceeded(payload) {
  return {
    type: 'CREATE_SUCCEED',
    payload,
  };
}

/**
 * @param {UserProfileState['create_error']} payload
 * @returns {AnyAction}
 */
export function createFailed(payload) {
  return {
    type: 'CREATE_FAIL',
    payload,
  };
}

export function deleteKeySucceeded() {
  return {
    type: 'DELETE_KEY_SUCCEED',
  };
}

/**
 * @param {UserProfileState['delete_error']} payload
 * @returns {AnyAction}
 */
export function deleteKeyFailed(payload) {
  return {
    type: 'DELETE_KEY_FAIL',
    payload,
  };
}

export function clearDeleteKeySession() {
  return {
    type: 'CLEAR_DELETE_KEY_SESSION',
  };
}

export function clearCreationSession() {
  return {
    type: 'CLEAR_CREATION_SESSION',
  };
}
