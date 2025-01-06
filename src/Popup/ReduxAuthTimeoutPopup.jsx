import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Popup from '../components/Popup';
import { logoutAPI } from '../actions';

const goToLogin = (history) => {
  history.push('/login');
  // Refresh the page.jsx.
  window.location.reload();
};

const AuthPopup = withRouter(
  ({ history }) => (
    <Popup
      title='Session Expired / Logged Out'
      message={['Your session has expired or you are logged out. Please log in to continue.']}
      rightButtons={[
        {
          caption: 'Go to Login',
          fn: () => { goToLogin(history); },
        },
      ]}
    />
  ),
);

const calculateMinRemaining = (inactivityWarningTime) => {
  const minRemain = Math.ceil((inactivityWarningTime - Date.now()) / 60000);
  return [`Due to inactivity, your session will expire in ${minRemain} minute${minRemain > 1 ? 's' : ''}`];
};

const WarnPopup = ({ logOut, closeWarnPopup, inactivityWarningTime }) => {
  const [message, setMessage] = useState(calculateMinRemaining(inactivityWarningTime));
  setTimeout(() => {
    setMessage(calculateMinRemaining(inactivityWarningTime));
  }, 60000);
  return (
    <Popup
      title='Extend Your Session to Stay Logged In'
      message={message}
      rightButtons={[
        {
          caption: 'Extend Session',
          fn: closeWarnPopup,
        },
      ]}
      leftButtons={[
        {
          caption: 'Log Out',
          fn: logOut,
        },
      ]}
    />
  );
};

const timeoutPopupMapState = (state) => ({
  authPopup: state.popups.authPopup,
  inactivityWarningPopup: state.popups.inactivityWarningPopup,
  inactivityWarningTime: state.popups.inactivityWarningTime,
});

const timeoutPopupMapDispatch = (dispatch) => ({
  logOut: () => dispatch(logoutAPI(true)),
  closeWarnPopup: () => dispatch({
    type: 'UPDATE_POPUP',
    data: {
      inactivityWarningPopup: false,
    },
  }),
});

const ReduxAuthTimeoutPopup = connect(timeoutPopupMapState, timeoutPopupMapDispatch)(
  ({
    authPopup, inactivityWarningPopup, inactivityWarningTime, logOut, closeWarnPopup,
  }) => {
    if (authPopup) {
      return (<AuthPopup />);
    } if (inactivityWarningPopup) {
      return (<WarnPopup logOut={logOut} closeWarnPopup={closeWarnPopup} inactivityWarningTime={inactivityWarningTime} />);
    }
    return null;
  },
);

export default ReduxAuthTimeoutPopup;
