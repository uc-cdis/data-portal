import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SimplePopup from '../components/SimplePopup';
import { headers, userapiPath } from '../localconf';
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
 * @param {(response: Response) => Promise<('success' | 'error')>} prop.updateAccess
 */
function UserRegistration({ shouldRegister, updateAccess }) {
  const [show, setShow] = useState(shouldRegister);

  function handleClose() {
    setShow(false);
  }

  function handleRegister(/** @type {UserRegistrationInput} */ userInput) {
    return fetch(`${userapiPath}user/`, {
      body: JSON.stringify(userInput),
      credentials: 'include',
      headers,
      method: 'PUT',
    }).then(updateAccess);
  }

  function handleSubscribe() {
    window.open('http://sam.am/PCDCnews', '_blank');
  }

  return (
    show && (
      <SimplePopup>
        <RegistrationForm
          onClose={handleClose}
          onRegister={handleRegister}
          onSubscribe={handleSubscribe}
        />
      </SimplePopup>
    )
  );
}

UserRegistration.propTypes = {
  shouldRegister: PropTypes.bool.isRequired,
  updateAccess: PropTypes.func.isRequired,
};

export default UserRegistration;
