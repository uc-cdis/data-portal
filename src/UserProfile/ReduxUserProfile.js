import { connect } from 'react-redux';

import UserProfile from './UserProfile';
import { updatePopup } from '../actions';
import {
  clearCreationSession,
  clearDeleteKeySession,
  requestDeleteKey,
} from './actions';
import { createKey, deleteKey, fetchAccess } from './actions.thunk';

/** @typedef {import('redux-thunk').ThunkDispatch} ThunkDispatch */
/** @typedef {import('../types').PopupState} PopupState */
/** @typedef {import('../types').UserState} UserState */
/** @typedef {import('./types').JtiData} JtiData */
/** @typedef {import('./types').UserProfileState} UserProfileState */

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
