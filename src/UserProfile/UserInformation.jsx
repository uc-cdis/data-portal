import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../gen3-ui-component/components/Button';
import { headers, userapiPath } from '../localconf';
import SimpleInputField from '../components/SimpleInputField';
import './UserInformation.css';

/**
 * @param {Object} props
 * @param {string} props.id
 * @param {string} props.label
 * @param {string} props.name
 * @param {string} [props.value]
 * @param {boolean} [props.isEditable]
 * @param {(newInformation: { [name: string]: string }) => Promise<('success' | 'error')>} [props.onSubmit]
 */
function UserInformationField({
  id,
  label,
  name,
  value = '',
  isEditable,
  onSubmit,
}) {
  const inputEl = useRef(null);
  const [inputValue, setInputValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  useEffect(() => {
    if (submitStatus !== null) {
      const timeout = setTimeout(() => setSubmitStatus(null), 1500);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [submitStatus]);

  function handleChange(e) {
    setInputValue(e.target.value);
  }
  function handleCancel() {
    setIsEditing(false);
    setInputValue(value);
  }
  function handleSubmit() {
    setIsSubmitting(true);
    onSubmit({ [name]: inputValue }).then((status) => {
      setIsSubmitting(false);
      if (status === 'error') setInputValue(value);
      setSubmitStatus(status);
      setIsEditing(false);
    });
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
            id={id}
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
                enabled={value !== inputValue && !isSubmitting}
                onClick={handleSubmit}
              />
            </>
          ) : (
            <Button label='Edit' buttonType='default' onClick={handleEdit} />
          )}
        </div>
      )}
      {submitStatus &&
        (submitStatus === 'success' ? (
          <div className='user-information__submit-message'>
            <FontAwesomeIcon
              icon='check-circle'
              color='var(--g3-color__lime)'
            />
            Updated successfully!
          </div>
        ) : (
          <div className='user-information__submit-message'>
            <FontAwesomeIcon
              icon='exclamation-triangle'
              color='var(--g3-color__rose)'
            />
            Update failed! Please try again.
          </div>
        ))}
    </div>
  );
}

UserInformationField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  isEditable: PropTypes.bool,
  onSubmit: PropTypes.func,
};

/**
 * @typedef {Object} UserInformationProps
 * @property {string} email
 * @property {string} [firstName]
 * @property {string} [lastName]
 * @property {string} [institution]
 * @property {(response: Response) => Promise<('success' | 'error')>} [updateInformation]
 */

/** @param {UserInformationProps} props */
function UserInformation({
  email,
  firstName,
  lastName,
  institution,
  updateInformation,
}) {
  function onSubmit(/** @type {{ [name: string]: string }} */ newInformation) {
    return fetch(`${userapiPath}user/`, {
      body: JSON.stringify({
        firstName,
        lastName,
        institution,
        ...newInformation,
      }),
      credentials: 'include',
      headers,
      method: 'PUT',
    }).then(updateInformation);
  }

  return (
    <div className='user-information__container'>
      <h2>Your information</h2>
      <UserInformationField
        id='user-info-email'
        label='Email'
        name='email'
        value={email}
        onSubmit={onSubmit}
      />
      <UserInformationField
        id='user-info-first-name'
        label='First name'
        name='firstName'
        value={firstName}
        isEditable
        onSubmit={onSubmit}
      />
      <UserInformationField
        id='user-info-last-name'
        label='Last name'
        name='lastName'
        value={lastName}
        isEditable
        onSubmit={onSubmit}
      />
      <UserInformationField
        id='user-info-institution'
        label='Institutional affiliation'
        name='institution'
        value={institution}
        isEditable
        onSubmit={onSubmit}
      />
    </div>
  );
}

UserInformation.propTypes = {
  email: PropTypes.string.isRequired,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  institution: PropTypes.string,
  updateInformation: PropTypes.func,
};

export default UserInformation;
