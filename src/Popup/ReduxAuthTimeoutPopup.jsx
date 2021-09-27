import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Popup from '../components/Popup';

/** @param {{ authPopup: boolean; }} props  */
function AuthPopup({ authPopup }) {
  const history = useHistory();
  return authPopup ? (
    <Popup
      message='Your session has expired or you are logged out. Please log in to continue.'
      rightButtons={[
        {
          caption: 'Go to Login',
          fn: () => {
            history.push('/login');
            // Refresh the page.jsx.
            window.location.reload();
          },
        },
      ]}
    />
  ) : null;
}

AuthPopup.propTypes = {
  authPopup: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  authPopup: state.popups.authPopup,
});

const ReduxAuthTimeoutPopup = connect(mapStateToProps)(AuthPopup);

export default ReduxAuthTimeoutPopup;
