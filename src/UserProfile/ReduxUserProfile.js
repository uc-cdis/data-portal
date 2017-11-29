import { connect } from 'react-redux';

import UserProfile from './UserProfile';
import { fetchOAuthURL, fetchJsonOrText, fetchProjects, updatePopup } from '../actions';
import { submissionApiOauthPath, credentialCdisPath } from '../localconf';


export const fetchAccess = () =>
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


const requestDeleteKey = accessKey => ({
  type: 'REQUEST_DELETE_KEY',
  access_key: accessKey,
});

const clearDeleteSession = () => ({
  type: 'CLEAR_DELETE_KEY_SESSION',
});


const deleteKey = (accessKey, keypairsApi) =>
  dispatch => fetchJsonOrText({
    path: keypairsApi + accessKey,
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
            access_key: accessKey,
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
          error: `Error: ${(data.error || data.message)}`,
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
