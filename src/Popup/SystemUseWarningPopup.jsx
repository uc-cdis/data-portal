import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Popup from '../components/Popup';
import { components } from '../params';
import getReduxStore from '../reduxStore';
import { updateSystemUseNotice } from '../actions';

const goToLogin = (history) => {
  history.push('/login');
  // Refresh the page.jsx.
  window.location.reload();
};

const handleAcceptWarning = (dispatch) =>
  if (components.login.displayUseMsg === "cookie") {
    // set a new cookie indicating we have accepted this policy if
    // we are using cookies
    const expiry = new Date();
    const defaultDays = components.login.expireUseMsgDays ? components.login.expireUseMsgDays : 10;

    expiry.setTime(expiry.getTime() + (defaultDays * 1440 * 1 * 60 * 1000)); // number of days
    // Date()'s toGMTSting() method will format the date correctly for a cookie
    document.cookie = 'systemUseWarning=yes; expires=' + expiry.toGMTString();
  }
  dispatch(updateSystemUseNotice(false));
};

const SystemUsePopup =
  (props) => {
  const { messageText, onAccept} = props;
    return (
      <Popup
        message={ messageText }
        rightButtons={[
          {
            caption: 'Accept',
            fn: () => {
              onAccept();
            },
          },
        ]}
      />
    )
  },
);



const showPopupMapState = (state) => ({
  systemUseWarnPopup: state.popups.systemUseWarnPopup,
});

const updatePopupMapDispatch = (dispatch) => ({
    handleAcceptWarning(dispatch)
});

const ReduxSystemUseWarningPopup = connect(showPopupMapState, updatePopupMapDispatch)(
  ({ systemUseWarnPopup }) => {
    if (components.login.systemUseText && systemUseWarnPopup) {
      return (<SystemUsePopup />);
    }
    return null;
  },
);

export default ReduxSystemUseWarningPopup;
