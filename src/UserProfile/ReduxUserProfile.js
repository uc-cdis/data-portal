import { connect } from 'react-redux';

import UserProfile from './UserProfile';
import { updatePopup } from '../redux/popups/slice';
import {
  clearCreationSession,
  clearDeleteKeySession,
  requestDeleteKey,
} from '../redux/userProfile/slice';
import {
  createKey,
  deleteKey,
  fetchAccess,
} from '../redux/userProfile/asyncThunks';

/** @typedef {import('./types').JtiData} JtiData */

/** @param {import('../redux/types').RootState} state */
const mapStateToProps = (state) => ({
  userInformation: {
    ...state.user.additional_info,
    email: state.user.username,
  },
  userProfile: state.userProfile,
  popups: state.popups,
});

/** @param {import('../redux/types').AppDispatch} dispatch */
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
    dispatch(deleteKey({ jti, exp, path }));
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
  /** @param {Partial<import('../redux/types').RootState['popups']>} state */
  onUpdatePopup: (state) => {
    dispatch(updatePopup(state));
  },
});

const ReduxUserProfile = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile);
export default ReduxUserProfile;
