import { connect } from 'react-redux';

import UserProfile from './UserProfile';
import { fetchWithCreds, updatePopup } from '../actions';
import { credentialCdisPath } from '../localconf';


export const fetchAccess = () =>
  dispatch =>
    fetchWithCreds({
      path: credentialCdisPath,
      dispatch,
    })
      .then(
        ({ status, data }) => {
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
        },
      )
      .then(msg => dispatch(msg));


const requestDeleteKey = (jti, exp) => ({
  type: 'REQUEST_DELETE_KEY',
  jti,
  exp,
});

const clearDeleteSession = () => ({
  type: 'CLEAR_DELETE_KEY_SESSION',
});


/*
  @param {string} jti is the token id
  @param {number} exp is expiration
*/
export const deleteKey = (jti, exp, keypairsApi) =>
  dispatch => fetchWithCreds({
    path: keypairsApi + jti,
    method: 'DELETE',
    body: JSON.stringify({
      exp,
    }),
    dispatch,
  })
    .then(
      ({ status, data }) => {
        switch (status) {
        case 204:
          dispatch({
            type: 'DELETE_KEY_SUCCEED',
          });
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
      },
    );


export const createKey = keypairsApi => dispatch => fetchWithCreds({
  path: keypairsApi,
  method: 'POST',
  body: JSON.stringify({
    scope: ['data', 'user'],
  }),
  dispatch,
  customHeaders: { 'Content-Type': 'application/json' },
})
  .then(
    ({ status, data }) => {
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
          error: `Error: ${(data.error || data.message)}`,
        });
        return dispatch(updatePopup({ saveTokenPopup: true }));
      }
    },
  );


const clearCreationSession = () => ({
  type: 'CLEAR_CREATION_SESSION',
});

const mapStateToProps = state => ({
  user: state.user,
  userProfile: state.userProfile,
  popups: state.popups,
  submission: state.submission,
});

const mapDispatchToProps = dispatch => ({
  onCreateKey: keypairsApi => dispatch(createKey(keypairsApi)),
  onUpdatePopup: state => dispatch(updatePopup(state)),
  onDeleteKey: (jti, exp, keypairsApi) =>
    dispatch(deleteKey(jti, exp, keypairsApi)),
  onRequestDeleteKey: (jti, exp, keypairsApi) =>
    dispatch(fetchAccess(keypairsApi)).then(() => dispatch(requestDeleteKey(jti, exp))),
  onClearDeleteSession: () => dispatch(clearDeleteSession()),
  onClearCreationSession: () => dispatch(clearCreationSession()),
});

const ReduxUserProfile = connect(mapStateToProps, mapDispatchToProps)(UserProfile);
export default ReduxUserProfile;
