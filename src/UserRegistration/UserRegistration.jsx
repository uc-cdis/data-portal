import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import RegistrationForm from './RegistrationForm';
import './UserRegistration.css';

/**
 * @typedef {Object} UserRegistrationInput
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} institution
 */

/**
 * @param {Object} prop
 * @param {boolean} prop.shouldRegister
 */
function UserRegistration({ shouldRegister }) {
  const [show, setShow] = useState(shouldRegister);

  function handleClose() {
    setShow(false);
  }

  function handleRegister(/** @type {UserRegistrationInput} */ userInput) {
    alert(`Registered!\n\n${JSON.stringify(userInput, null, 4)}`);
  }

  function handleSubscribe(/** @type {UserRegistrationInput} */ userInput) {
    alert(`Subscribed!\n\n${JSON.stringify(userInput, null, 4)}`);
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
