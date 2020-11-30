import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import SimpleInputField from '../components/SimpleInputField';
import './UserInformation.css';

/**
 * @param {Object} props
 * @param {string} props.label
 * @param {string} props.name
 * @param {string} [props.value]
 * @param {boolean} [props.isEditable]
 */
function UserInformationField({ label, name, value = '', isEditable }) {
  const inputEl = useRef(null);
  const [inputValue, setInputValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  function handleChange(e) {
    setInputValue(e.target.value);
  }
  function handleCancel() {
    setIsEditing(false);
    setInputValue(value);
  }
  function handleSubmit() {
    setIsEditing(false);
  }
  function handleEdit() {
    setIsEditing(true);
    inputEl.current.focus();
  }

  return (
    <div className='user-information__field'>
      <SimpleInputField
        label={label}
        input={
          <input
            ref={inputEl}
            readOnly={!isEditing}
            name={name}
            value={inputValue}
            onChange={handleChange}
            placeholder='N/A'
          />
        }
      />
      {isEditable && (
        <div className='user-information__button-group'>
          {isEditing ? (
            <>
              <Button
                label='Cancel'
                buttonType='default'
                onClick={handleCancel}
              />
              <Button
                label='Submit'
                buttonType='primary'
                onClick={handleSubmit}
              />
            </>
          ) : (
            <Button label='Edit' buttonType='default' onClick={handleEdit} />
          )}
        </div>
      )}
    </div>
  );
}

/**
 * @param {Object} props
 * @param {string} props.email
 * @param {string} [props.firstName]
 * @param {string} [props.lastName]
 * @param {string} [props.institution]
 */
function UserInformation({ email, firstName, lastName, institution }) {
  return (
    <div className='user-information__container'>
      <h2>Your information</h2>
      <UserInformationField label='Email' name='email' value={email} />
      <UserInformationField
        label='First name'
        name='firstName'
        value={firstName}
        isEditable
      />
      <UserInformationField
        label='Last name'
        name='lastName'
        value={lastName}
        isEditable
      />
      <UserInformationField
        label='Institutional affiliation'
        name='institution'
        value={institution}
        isEditable
      />
    </div>
  );
}

UserInformation.propTypes = {
  email: PropTypes.string.isRequired,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  institution: PropTypes.string,
};

export default UserInformation;
