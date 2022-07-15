import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import Popup from '../components/Popup';

export default function AuthPopup() {
  const navigate = useNavigate();
  const authPopup = useAppSelector((state) => state.popups.authPopup);
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
