import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import SimpleInputField from '../components/SimpleInputField';
import './UserInformation.css';

/**
 * @param {Object} props
 * @param {string} props.label
 * @param {string} [props.value]
 * @param {boolean} [props.isEditable]
 */
function UserInformationField({ label, value, isEditable }) {
  const inputEl = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className='user-information__field'>
      <SimpleInputField
        label={label}
        input={
          <input
            ref={inputEl}
            readOnly={!isEditing}
            value={value}
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
                onClick={() => setIsEditing(false)}
              />
              <Button
                label='Submit'
                buttonType='primary'
                onClick={() => setIsEditing(false)}
              />
            </>
          ) : (
            <Button
              label='Edit'
              buttonType='default'
              onClick={() => {
                setIsEditing(true);
                inputEl.current.focus();
              }}
            />
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
      <UserInformationField label='Email' value={email} />
      <UserInformationField label='First name' value={firstName} isEditable />
      <UserInformationField label='Last name' value={lastName} isEditable />
      <UserInformationField
        label='Institutional affiliation'
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
