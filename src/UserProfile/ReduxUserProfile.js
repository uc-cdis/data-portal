import { connect } from 'react-redux';

import UserProfile from './UserProfile';
import { fetchOAuthURL, fetchJsonOrText, updatePopup } from '../actions';
import { submissionApiOauthPath, credentialCdisPath } from '../localconf';
import { fetchProjects } from '../queryactions';


const fetchAccess = () =>
  dispatch =>
    fetchJsonOrText({
      path: credentialCdisPath,
      dispatch,
    })
      .then(
        ({ status, data }) => {
          switch (status) {
          case 200:
            return {
              type: 'RECEIVE_USER_PROFILE',
              access_keys: data.access_keys,
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


const fetchUserApiLogin = userOauthUrl =>
  dispatch =>
    fetchJsonOrText(
      {
        path: userOauthUrl,
        dispatch,
      },
    )
      .then(
        ({ status, data }) => {
          switch (status) {
          case 200:
            return {
              type: 'RECEIVE_USERAPI_LOGIN',
              result: true,
            };
          default:
            return {
              type: 'RECEIVE_USERAPI_LOGIN',
              result: false,
              error: data,
            };
          }
        })
      .then(msg => dispatch(msg))
  ;

export const loginUserProfile = () =>
  // Fetch projects, if unauthorized, login
  (dispatch, getState) =>
    dispatch(fetchAccess())
      .then(
        () => {
          const keypair = getState().userProfile.access_key_pair;
          if (keypair) {
          // user already logged in
            return Promise.reject('already logged in');
          }
          return Promise.resolve();
        })
      .then(
        () => dispatch(fetchOAuthURL(submissionApiOauthPath)),
      )
      .then(
        () => {
          const url = getState().user.oauth_url;
          return dispatch(fetchUserApiLogin(url));
        },
      )
      .then(() => dispatch(fetchAccess()))
      .then(() => dispatch(fetchProjects()))
      .catch(error => console.log(error))
  ;


const requestDeleteKey = access_key => ({
  type: 'REQUEST_DELETE_KEY',
  access_key,
});

const clearDeleteSession = () => ({
  type: 'CLEAR_DELETE_KEY_SESSION',
});


const deleteKey = (access_key, keypairsApi) =>
  dispatch => fetchJsonOrText({
    path: keypairsApi + access_key,
    method: 'DELETE',
    dispatch,
  })
    .then(
      ({ status, data }) => {
        switch (status) {
        case 201:
          dispatch({
            type: 'DELETE_KEY_SUCCEED',
          });
          dispatch(clearDeleteSession());
          dispatch(updatePopup({ key_delete_popup: false }));
          return dispatch(fetchAccess());
        default:
          return dispatch({
            type: 'DELETE_KEY_FAIL',
            access_key,
            error: data,
          });
        }
      },
    );


export const parseKeyToString = content => `access_key\tsecrect_key\n${content.access_key}\t${content.secret_key}`;

export const createKey = keypairsApi => dispatch => fetchJsonOrText({
  path: keypairsApi,
  method: 'POST',
  dispatch,
})
  .then(
    ({ status, data }) => {
      switch (status) {
      case 200:
        dispatch({
          type: 'CREATE_SUCCEED',
          access_key_pair: data,
          str_access_key_pair: parseKeyToString(data),
        });
        dispatch(updatePopup({ save_key_popup: true }));
        return dispatch(fetchAccess());
      default:
        dispatch({
          type: 'CREATE_FAIL',
          error: data.error,
        });
        return dispatch(updatePopup({ save_key_popup: true }));
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
  onDeleteKey: (accessKey, keypairsApi) =>
    dispatch(deleteKey(accessKey, keypairsApi)),
  onRequestDeleteKey: (accessKey, keypairsApi) =>
    dispatch(fetchAccess(keypairsApi)).then(
      () => dispatch(requestDeleteKey(accessKey)),
    ),
  onClearDeleteSession: () => dispatch(clearDeleteSession()),
  onClearCreationSession: () => dispatch(clearCreationSession()),
});

const ReduxUserProfile = connect(mapStateToProps, mapDispatchToProps)(UserProfile);
export default ReduxUserProfile;
