import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import RegistrationForm from './RegistrationForm';
import './UserRegistration.css';

/**
 * @param {Object} prop
 * @param {boolean} prop.shouldRegister
 */
function UserRegistration({ shouldRegister }) {
  const [show, setShow] = useState(shouldRegister);

  function handleClose() {
    setShow(false);
  }

  function handleRegister() {
    alert('Registered!');
  }

  function handleSubscribe() {
    alert('Subscribed!');
  }

  return show
    ? ReactDOM.createPortal(
        <div className='user-registration__overlay'>
          <RegistrationForm
            onClose={handleClose}
            onRegister={handleRegister}
            onSubscribe={handleSubscribe}
          />
        </div>,
        document.getElementById('root')
      )
    : null;
}

UserRegistration.propTypes = {
  shouldRegister: PropTypes.bool.isRequired,
};

export default UserRegistration;
