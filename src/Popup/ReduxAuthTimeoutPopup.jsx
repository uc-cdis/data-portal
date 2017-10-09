import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Popup from './Popup';


const timeoutPopupMapState = state => ({
  auth_popup: state.popups.authPopup,
});

const timeoutPopupMapDispatch = () => ({});

const goToLogin = () => {
  browserHistory.push('/login');
  // Refresh the page.
  window.location.reload(false);
};

const ReduxAuthTimeoutPopup = connect(timeoutPopupMapState, timeoutPopupMapDispatch)(
  ({ authPopup }) => {
    if (authPopup) {
      return <Popup message={'Your session has expired or you are logged out. Please log in to continue.'} confirmText="go to login" onConfirm={goToLogin} />;
    }
    return (null);
  }
);


export default ReduxAuthTimeoutPopup;

