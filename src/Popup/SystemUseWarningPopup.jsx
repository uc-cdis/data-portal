import React from 'react';
import { connect } from 'react-redux';
import Popup from '../components/Popup';
import { components } from '../params';
import { updateSystemUseNotice } from '../actions';

const handleAcceptWarning = () => {
  /**
   * If policy is accepted then set systemUseWarnPopup to false, hiding the
   * warning.
   */
  if (components.systemUse.displayUseMsg === 'cookie') {
    // set a new cookie indicating we have accepted this policy if
    // we are using cookies to track acceptance over multiple sessions
    const expiry = new Date();
    const defaultDays = components.systemUse.expireUseMsgDays ? components.systemUse.expireUseMsgDays : 10;

    expiry.setTime(expiry.getTime() + (defaultDays * 1440 * 1 * 60 * 1000)); // number of days
    document.cookie = 'systemUseWarning=yes; expires=' + expiry.toGMTString();
  }
  return (dispatch) => dispatch(updateSystemUseNotice(false));
};

const SystemUsePopup = (props) => {
  const { messageText, onAccept } = props;
  return (
    <Popup
      message={messageText}
      rightButtons={[
        {
          caption: 'Accept',
          fn: () => {
            onAccept();
          },
        },
      ]}
    />
  );
};


const showPopupMapState = (state) => ({
  systemUseWarnPopup: state.popups.systemUseWarnPopup,
});

const updatePopupMapDispatch = (dispatch) => {
  return { onAccept: () => dispatch(handleAcceptWarning()) };
};

const ReduxSystemUseWarningPopup = connect(showPopupMapState, updatePopupMapDispatch)(
  ({ systemUseWarnPopup, onAccept }) => {
    if (systemUseWarnPopup) {
      return (
        <SystemUsePopup messageText={components.systemUse.systemUseText} onAccept={onAccept}/>);
    }
    return null;
  },
);

export default ReduxSystemUseWarningPopup;
