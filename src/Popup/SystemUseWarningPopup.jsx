import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Popup from '../components/Popup';
import { components } from '../params';
import { hostname } from '../localconf';
import { updateSystemUseNotice } from '../actions';

const handleAcceptWarning = () => {
  /**
   * If policy is accepted then set systemUseWarnPopup to false, hiding the
   * warning.
   */
  // set a new cookie indicating we have accepted this policy

  const hostnameParts = hostname.split('.');
  const hLen = hostnameParts.length;
  const hostnameNoSubdomain = (hLen > 2) ? hostnameParts.splice(hLen - 2).join('.') : hostname;
  const domain = hostnameNoSubdomain.endsWith('/') ? hostnameNoSubdomain.slice(0, -1) : hostnameNoSubdomain;

  const expiry = new Date();
  const defaultDays = 'expireUseMsgDays' in components.systemUse ? components.systemUse.expireUseMsgDays : 0;

  if (defaultDays === 0) { // session cookie
    document.cookie = `systemUseWarning=yes; expires=0; path=/; domain=.${domain}`;
  } else {
    expiry.setTime(expiry.getTime() + (defaultDays * 1440 * 1 * 60 * 1000)); // number of days
    document.cookie = `systemUseWarning=yes; expires=${expiry.toGMTString()}; path=/; domain=.${domain}`;
  }

  return (dispatch) => dispatch(updateSystemUseNotice(false));
};

const SystemUsePopup = (props) => {
  const { titleText, messageText, onAccept } = props;
  return (
    <Popup
      title={titleText}
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

SystemUsePopup.propTypes = {
  titleText: PropTypes.string.isRequired,
  messageText: PropTypes.array.isRequired,
  onAccept: PropTypes.func.isRequired,
};

const showPopupMapState = (state) => ({
  systemUseWarnPopup: state.popups.systemUseWarnPopup,
});

const updatePopupMapDispatch = (dispatch) => ({ onAccept: () => dispatch(handleAcceptWarning()) });

const ReduxSystemUseWarningPopup = connect(showPopupMapState, updatePopupMapDispatch)(
  ({ systemUseWarnPopup, onAccept }) => {
    if (systemUseWarnPopup) {
      return (
        <SystemUsePopup titleText={components.systemUse.systemUseTitle} messageText={components.systemUse.systemUseText} onAccept={onAccept} />);
    }
    return null;
  },
);

export default ReduxSystemUseWarningPopup;
