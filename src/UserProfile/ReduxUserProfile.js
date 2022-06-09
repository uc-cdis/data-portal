import { connect } from 'react-redux';

import UserProfile from './UserProfile';
import { fetchWithCreds, updatePopup } from '../actions';
import { credentialCdisPath } from '../localconf';
import {
  clearCreationSession,
  clearDeleteKeySession,
  createFailed,
  createSucceeded,
  deleteKeyFailed,
  deleteKeySucceeded,
  receiveUserProfile,
  requestDeleteKey,
  userProfileErrored,
} from './actions';

/** @typedef {import('redux').AnyAction} AnyAction */
/** @typedef {import('redux').Dispatch} Dispatch */
/** @typedef {import('redux-thunk').ThunkDispatch} ThunkDispatch */
/** @typedef {import('./types').JtiData} JtiData */
/** @typedef {import('./types').UserProfileState} UserProfileState */
/** @typedef {import('../types').UserState} UserState */
/** @typedef {import('../types').PopupState} PopupState */

export const fetchAccess = () => (/** @type {Dispatch} */ dispatch) =>
  fetchWithCreds({
    path: credentialCdisPath,
    dispatch,
  })
    .then(({ status, data }) => {
      switch (status) {
        case 200:
          return receiveUserProfile(data.jtis);
        default:
          return userProfileErrored(data.error);
      }
    })
    .then((msg) => dispatch(msg));

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
          dispatch(deleteKeySucceeded());
          dispatch(clearDeleteKeySession());
          dispatch(updatePopup({ deleteTokenPopup: false }));
          return dispatch(fetchAccess());
        default:
          return dispatch(deleteKeyFailed(data));
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
        dispatch(
          createSucceeded({
            refreshCred: data,
            strRefreshCred: JSON.stringify(data, null, '\t'),
          })
        );
        dispatch(updatePopup({ saveTokenPopup: true }));
        return dispatch(fetchAccess());
      default:
        dispatch(createFailed(`Error: ${data.error || data.message}`));
        return dispatch(updatePopup({ saveTokenPopup: true }));
    }
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
    dispatch(clearDeleteKeySession());
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
   * @param {JtiData['jti']} requestDeleteJTI
   * @param {JtiData['exp']} requestDeleteExp
   */
  onRequestDeleteKey: (requestDeleteJTI, requestDeleteExp) => {
    dispatch(fetchAccess()).then(() =>
      dispatch(requestDeleteKey({ requestDeleteJTI, requestDeleteExp }))
    );
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
