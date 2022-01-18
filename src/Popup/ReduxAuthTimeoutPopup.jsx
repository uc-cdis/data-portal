import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Popup from '../components/Popup';

/** @typedef {import('./types').PopupState} PopupState */

/** @param {{ authPopup: PopupState['authPopup'] }} props  */
function AuthPopup({ authPopup }) {
  const navigate = useNavigate();
  return authPopup ? (
    <Popup
      message='Your session has expired or you are logged out. Please log in to continue.'
      rightButtons={[
        {
          caption: 'Go to Login',
          fn: () => {
            navigate('/login');
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

/** @param {{ popups: PopupState }} state */
const mapStateToProps = (state) => ({
  authPopup: state.popups.authPopup,
});

const ReduxAuthTimeoutPopup = connect(mapStateToProps)(AuthPopup);

export default ReduxAuthTimeoutPopup;
