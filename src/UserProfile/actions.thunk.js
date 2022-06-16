import { updatePopup } from '../actions';
import { fetchWithCreds } from '../actions.thunk';
import { credentialCdisPath } from '../localconf';
import {
  clearDeleteKeySession,
  createFailed,
  createSucceeded,
  deleteKeyFailed,
  deleteKeySucceeded,
  receiveUserProfile,
  userProfileErrored,
} from './actions';

/** @typedef {import('redux').Dispatch} Dispatch */
/** @typedef {import('redux-thunk').ThunkDispatch} ThunkDispatch */
/** @typedef {import('./types').JtiData} JtiData */
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
