import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../gen3-ui-component/components/Button';
import SimpleInputField from '../components/SimpleInputField';

/**
 * @typedef {Object} UserRegistrationInput
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} institution
 */

/** @typedef {('input' | 'success' | 'error')} UserRegistrationView  */

/**
 * @param {Object} prop
 * @param {() => void} prop.onClose
 * @param {(userInput: UserRegistrationInput) => Promise<('success' | 'error')>} prop.onRegister
 * @param {(userInput: UserRegistrationInput) => void} prop.onSubscribe
 */
function RegistrationForm({ onClose, onRegister, onSubscribe }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [institution, setInstitution] = useState('');
  const [isValidInput, setIsValidInput] = useState(false);
  useEffect(() => {
    setIsValidInput(firstName !== '' && lastName !== '' && institution !== '');
  }, [firstName, lastName, institution]);

  /** @type {[UserRegistrationView, React.Dispatch<React.SetStateAction<UserRegistrationView>>]} */
  const [currentView, setCurrentView] = useState('input');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  function handleRegister() {
    setIsRegistering(true);
    onRegister({ firstName, lastName, institution }).then((status) => {
      setIsRegistering(false);
      setCurrentView(status);
    });
  }

  function handleClose() {
    if (isSubscribed) onSubscribe({ firstName, lastName, institution });
    onClose();
  }

  const viewInput = (
    <div className='user-registration__view-input'>
      <p>
        <FontAwesomeIcon
          icon='exclamation-triangle'
          color='var(--g3-color__highlight-orange)'
        />
        Your account does not have access to PCDC data.
        <br />
        Please register to gain access.
      </p>
      <SimpleInputField
        label='First name'
        input={
          <input
            type='text'
            value={firstName}
            autoFocus
            disabled={isRegistering}
            placeholder='Enter your first name'
            required
            onChange={(e) => setFirstName(e.target.value)}
          />
        }
      />
      <SimpleInputField
        label='Last name'
        input={
          <input
            type='text'
            value={lastName}
            disabled={isRegistering}
            placeholder='Enter your last name'
            required
            onChange={(e) => setLastName(e.target.value)}
          />
        }
      />
      <SimpleInputField
        label='Institution'
        input={
          <input
            type='text'
            value={institution}
            disabled={isRegistering}
            placeholder='e.g. University of Chicago'
            required
            onChange={(e) => setInstitution(e.target.value)}
          />
        }
      />
    </div>
  );

  const viewSuccess = (
    <div className='user-registration__view-success'>
      <h2>Thank you for registering!</h2>
      <p>
        You now have access to PCDC data based on your institutional
        affiliation.
      </p>
      <div className='user-registration__subscribe'>
        <input
          type='checkbox'
          checked={isSubscribed}
          onChange={(e) => setIsSubscribed(e.target.checked)}
        />
        Subscribe to the quarterly PCDC newsletter to get the latest updates on
        the PCDC project and more.
      </div>
    </div>
  );

  const viewError = (
    <div className='user-registration__view-error'>
      <FontAwesomeIcon
        icon='exclamation-triangle'
        color='var(--g3-color__highlight-rose)'
      />
      <h2>Error registering to gain access...</h2>
      <p>
        Please retry or refreshing the page. If the problem persists, please
        contact administrator for more information.
      </p>
    </div>
  );

  return (
    <form className='user-registration__form'>
      {currentView === 'input'
        ? viewInput
        : currentView === 'success'
        ? viewSuccess
        : viewError}
      <div>
        <Button
          label='Back to page'
          buttonType='default'
          onClick={handleClose}
        />
        {currentView === 'input' && (
          <Button
            type='submit'
            label='Register'
            enabled={isValidInput && !isRegistering}
            onClick={handleRegister}
          />
        )}
      </div>
    </form>
  );
}

RegistrationForm.propTypes = {
  onClose: PropTypes.func,
  onRegister: PropTypes.func,
  onSubscribe: PropTypes.func,
};

export default RegistrationForm;
