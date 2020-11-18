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

function RegistrationForm({ onClose, onRegister, onSubscribe }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [isValidInput, setIsValidInput] = useState(false);
  useEffect(() => {
    setIsValidInput(firstName !== '' && lastName !== '' && affiliation !== '');
  }, [firstName, lastName, affiliation]);

  const [isDone, setIsDone] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  function handleRegister() {
    onRegister();
    setIsDone(true);
  }

  function handleClose() {
    if (isSubscribed) onSubscribe();
    onClose();
  }

  const stepInput = (
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
        label='Affiliation'
        input={
          <input
            type='text'
            value={affiliation}
            placeholder='e.g. University of Chicago'
            required
            onChange={(e) => setAffiliation(e.target.value)}
          />
        }
      />
    </div>
  );

  const stepDone = (
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
      {isDone ? stepDone : stepInput}
      <div>
        <Button
          label='Back to page'
          buttonType='default'
          onClick={handleClose}
        />
        {!isDone && (
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
