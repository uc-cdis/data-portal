import { connect } from 'react-redux';

import UserProfile from './UserProfile';
import { fetchWithCreds, updatePopup } from '../actions';
import { credentialCdisPath } from '../localconf';

/** @typedef {import('redux').AnyAction} AnyAction */
/** @typedef {import('redux').Dispatch} Dispatch */
/** @typedef {import('redux-thunk').ThunkDispatch} ThunkDispatch */
/** @typedef {import('./types').JtiData} JtiData */
/** @typedef {import('./types').UserProfileState} UserProfileState */
/** @typedef {import('../types').UserState} UserState */
/** @typedef {import('../Popup/types').PopupState} PopupState */

export const fetchAccess = () => (/** @type {Dispatch} */ dispatch) =>
  fetchWithCreds({
    path: credentialCdisPath,
    dispatch,
  })
    .then(({ status, data }) => {
      switch (status) {
        case 200:
          return {
            type: 'RECEIVE_USER_PROFILE',
            jtis: data.jtis,
          };
        default:
          return {
            type: 'USER_PROFILE_ERROR',
            error: data.error,
          };
      }
    })
    .then((msg) => dispatch(msg));

/**
 * @param {JtiData['jti']} jti
 * @param {JtiData['exp']} exp
 * @returns {AnyAction}
 */
const requestDeleteKey = (jti, exp) => ({
  type: 'REQUEST_DELETE_KEY',
  jti,
  exp,
});

/** @returns {AnyAction} */
const clearDeleteSession = () => ({
  type: 'CLEAR_DELETE_KEY_SESSION',
});

/**
 * @param {JtiData['jti']} jti
 * @param {JtiData['exp']} exp
 * @param {string} path
 */
export const deleteKey =
  (jti, exp, path) => (/** @type {ThunkDispatch} */ dispatch) =>
    fetchWithCreds({
      path: path + jti,
      method: 'DELETE',
      body: JSON.stringify({ exp }),
      dispatch,
    }).then(({ status, data }) => {
      switch (status) {
        case 204:
          dispatch({ type: 'DELETE_KEY_SUCCEED' });
          dispatch(clearDeleteSession());
          dispatch(updatePopup({ deleteTokenPopup: false }));
          return dispatch(fetchAccess());
        default:
          return dispatch({
            type: 'DELETE_KEY_FAIL',
            jti,
            error: data,
          });
      }
    });

/** @param {string} path */
export const createKey = (path) => (/** @type {ThunkDispatch} */ dispatch) =>
  fetchWithCreds({
    path,
    method: 'POST',
    body: JSON.stringify({
      scope: ['data', 'user'],
    }),
    dispatch,
    customHeaders: new Headers({ 'Content-Type': 'application/json' }),
  }).then(({ status, data }) => {
    switch (status) {
      case 200:
        dispatch({
          type: 'CREATE_SUCCEED',
          refreshCred: data,
          strRefreshCred: JSON.stringify(data, null, '\t'),
        });
        dispatch(updatePopup({ saveTokenPopup: true }));
        return dispatch(fetchAccess());
      default:
        dispatch({
          type: 'CREATE_FAIL',
          error: `Error: ${data.error || data.message}`,
        });
        return dispatch(updatePopup({ saveTokenPopup: true }));
    }
  });

/** @returns {AnyAction} */
const clearCreationSession = () => ({
  type: 'CLEAR_CREATION_SESSION',
});

/**
 * @param {Object} state
 * @param {PopupState} state.popups
 * @param {UserState} state.user
 * @param {UserProfileState} state.userProfile
 */
const mapStateToProps = (state) => ({
  userInformation: {
    ...state.user.additional_info,
    email: state.user.username,
  },
  userProfile: state.userProfile,
  popups: state.popups,
});

/** @param {ThunkDispatch} dispatch */
const mapDispatchToProps = (dispatch) => ({
  onClearCreationSession: () => {
    dispatch(clearCreationSession());
  },
  onClearDeleteSession: () => {
    dispatch(clearDeleteSession());
  },
  /** @param {string} path */
  onCreateKey: (path) => {
    dispatch(createKey(path));
  },
  /**
   * @param {JtiData['jti']} jti
   * @param {JtiData['exp']} exp
   * @param {string} path
   */
  onDeleteKey: (jti, exp, path) => {
    dispatch(deleteKey(jti, exp, path));
  },
  /**
   * @param {JtiData['jti']} jti
   * @param {JtiData['exp']} exp
   */
  onRequestDeleteKey: (jti, exp) => {
    dispatch(fetchAccess()).then(() => dispatch(requestDeleteKey(jti, exp)));
  },
  /** @param {Partial<PopupState>} state */
  onUpdatePopup: (state) => {
    dispatch(updatePopup(state));
  },
});

const ReduxUserProfile = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile);
export default ReduxUserProfile;
