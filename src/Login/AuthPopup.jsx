import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Popup from '../components/Popup';

/** @param {{ popups: import('../types').PopupState }} state */
function authPopupSelector(state) {
  return state.popups.authPopup;
}

export default function AuthPopup() {
  const navigate = useNavigate();
  const authPopup = useSelector(authPopupSelector);
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
