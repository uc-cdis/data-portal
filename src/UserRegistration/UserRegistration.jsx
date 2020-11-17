import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import RegistrationForm from './RegistrationForm';
import './UserRegistration.css';

function UserRegistration({ shouldRegister }) {
  const [show, setShow] = useState(shouldRegister);

  return show
    ? ReactDOM.createPortal(
        <div className='user-registration__container'>
          <RegistrationForm onClose={() => setShow(false)} />
        </div>,
        document.getElementById('root')
      )
    : null;
}

UserRegistration.propTypes = {
  shouldRegister: PropTypes.bool.isRequired,
};

export default UserRegistration;
