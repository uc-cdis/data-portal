import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@gen3/ui-component/dist/components/Button';

/**
 * @param {Object} prop
 * @param {string} prop.label
 * @param {JSX.Element} prop.input
 */
const RegistrationFormField = ({ label, input }) => (
  <div className='user-registration__form__field-container'>
    <label className='user-registration__form__field-label'>{label}</label>
    <div className='user-registration__form__field-input'>{input}</div>
  </div>
);

/**
 * @typedef {Object} UserRegistrationInput
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} institution
 */

/**
 * @param {Object} prop
 * @param {() => void} prop.onClose
 * @param {(userInput: UserRegistrationInput) => void} prop.onRegister
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

  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  function handleRegister() {
    onRegister({ firstName, lastName, institution });
    setIsSuccess(true);
  }

  function handleClose() {
    if (isSubscribed) onSubscribe({ firstName, lastName, institution });
    onClose();
  }

  const viewInput = (
    <div className='user-registration__step-input'>
      <p>
        <FontAwesomeIcon
          className='screen-size-warning__icon'
          icon='exclamation-triangle'
          color='#EF8523' // g3-color__highlight-orange
        />
        Your account does not have access to PCDC data.
        <br />
        Please register to gain access.
      </p>
      <RegistrationFormField
        label='First name'
        input={
          <input
            type='text'
            value={firstName}
            autoFocus
            placeholder='Enter your first name'
            required
            onChange={(e) => setFirstName(e.target.value)}
          />
        }
      />
      <RegistrationFormField
        label='Last name'
        input={
          <input
            type='text'
            value={lastName}
            placeholder='Enter your last name'
            required
            onChange={(e) => setLastName(e.target.value)}
          />
        }
      />
      <RegistrationFormField
        label='Institution'
        input={
          <input
            type='text'
            value={institution}
            placeholder='e.g. University of Chicago'
            required
            onChange={(e) => setInstitution(e.target.value)}
          />
        }
      />
    </div>
  );

  const viewSuccess = (
    <div className='user-registration__step-done'>
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

  return (
    <form className='user-registration__form'>
      {isSuccess ? viewSuccess : viewInput}
      <div>
        <Button
          label='Back to page'
          buttonType='default'
          onClick={handleClose}
        />
        {!isSuccess && (
          <Button
            type='submit'
            label='Register'
            enabled={isValidInput}
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
