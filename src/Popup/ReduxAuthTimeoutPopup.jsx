import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Popup from '../components/Popup';


const goToLogin = (history) => {
  history.push('/login');
  // Refresh the page.jsx.
  window.location.reload(false);
};


const AuthPopup = withRouter(
  ({ history }) =>
    (<Popup
      message={'Your session has expired or you are logged out. Please log in to continue.'}
      rightButtons={[
        {
          caption: 'go to login',
          fn: () => { goToLogin(history); },
        },
      ]}
    />),
);

const timeoutPopupMapState = state => ({
  authPopup: state.popups.authPopup,
});

const timeoutPopupMapDispatch = () => ({});


const ReduxAuthTimeoutPopup = connect(timeoutPopupMapState, timeoutPopupMapDispatch)(
  ({ authPopup }) => {
    if (authPopup) {
      return (<AuthPopup />);
    }
    return null;
  },
);

export default ReduxAuthTimeoutPopup;
