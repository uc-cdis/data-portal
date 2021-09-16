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

const handleAcceptWarning = () => {
  // set a new cookie indicating we have accepted this policy
  const expiry = new Date();
  const defaultDays = components.login.expireUseMsgDays ? components.login.expireUseMsgDays : 10;

  expiry.setTime(expiry.getTime() + (defaultDays * 1440 * 1 * 60 * 1000)); // number of days
  // Date()'s toGMTSting() method will format the date correctly for a cookie
  document.cookie = 'systemUseWarning=yes; expires=' + expiry.toGMTString();
  getReduxStore()
    .then((store) => store.dispatch(updateSystemUseNotice(false)));
};

const SystemUsePopup = withRouter(
  ({ history }) => (
    <Popup
      message={ components.login.systemUseText }
      // message={'You are accessing a U.S. Government web site which may contain information that must be protected under the U. S. Privacy Act or other sensitive information and is intended for Government authorized use only.\n' +
      // '\n' +
      // 'Unauthorized attempts to upload information, change information, or use of this web site may result in disciplinary action, civil, and/or criminal penalties. Unauthorized users of this web site should have no expectation of privacy regarding any communications or data processed by this web site.\n' +
      // '\n' +
      // 'Anyone accessing this web site expressly consents to monitoring of their actions and all communication or data transiting or stored on or related to this web site and is advised that if such monitoring reveals possible evidence of criminal activity, NIH may provide that evidence to law enforcement officials.\n' +
      // '\n' +
      // 'Please be advised that some features may not work with higher privacy settings, such as disabling cookies.\n' +
      // '\n' +
      // 'WARNING: Data in the GDC is considered provisional as the GDC applies state-of-the art analysis pipelines which evolve over time. Please read the GDC Data Release Notes prior to accessing this web site as the Release Notes provide details about data updates, known issues and workarounds.\n' +
      // '\n' +
      // 'Contact GDC Support for more information.'}
      rightButtons={[
        {
          caption: 'Accept',
          fn: () => {
            handleAcceptWarning();
            // goToLogin(history);
          },
        },
      ]}
    />
  ),
);


const showPopupMapState = (state) => ({
  systemUseWarnPopup: state.popups.systemUseWarnPopup,
});

const updatePopupMapDispatch = () => ({});

const ReduxSystemUseWarningPopup = connect(showPopupMapState, updatePopupMapDispatch)(
  ({ systemUseWarnPopup }) => {
    if (systemUseWarnPopup) {
      return (<SystemUsePopup />);
    }
    return null;
  },
);

export default ReduxSystemUseWarningPopup;
