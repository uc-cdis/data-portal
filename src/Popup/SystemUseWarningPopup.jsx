import React, { useState, useLayoutEffect, createRef }  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Popup from '../components/Popup';
import { components } from '../params';
import { hostname } from '../localconf';
import { updateSystemUseNotice } from '../actions';
import './SystemUseWarningPopup.css';

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

const isVisible = (ele, container) => {
  const { bottom, height, top } = ele.current.getBoundingClientRect();
  const containerRect = container.current.getBoundingClientRect();
  return top <= containerRect.top ? containerRect.top - top <= height : bottom - containerRect.bottom <= height;
};

const SystemUsePopup = (props) => {
  const { titleText, messageText, onAccept } = props;
  const [atBottom, setAtBottom] = useState(false);
  const lastRef = createRef();
  const ref = createRef();

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (!atBottom) setAtBottom(bottom); // only set if never scrolled.
  };

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const lastElement = lastRef.current;
    if (!lastElement) {
      return;
    }

    if (isVisible(ref, lastRef)) {
      setAtBottom(true);
    }
  }, [ref, lastRef]);

  return (
    <Popup
      title={titleText}
      rightButtons={[
        {
          enabled: atBottom,
          caption: 'Accept',
          fn: () => {
            onAccept();
          },
        },
      ]}
    >
      { messageText && (
        <div ref={ref} className='scrolled-message' onScroll={handleScroll} >
          <div className='high-light'>{messageText.map((text, i) => (!messageText[i + 1]
            ? <p ref={lastRef} key={i}>{text}</p> : <p key={i}>{text}</p>))}
          </div>
        </div>
      )}
    </Popup>
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
