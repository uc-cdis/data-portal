import React from 'react';
import PropTypes from 'prop-types';
import SimpleInputField from '../components/SimpleInputField';
import './UserInformation.css';

/**
 * @param {Object} props
 * @param {string} props.label
 * @param {string} [props.value]
 */
function UserInformationField({ label, value }) {
  return (
    <SimpleInputField
      label={label}
      input={<input readOnly value={value} placeholder='N/A' />}
    />
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
      <UserInformationField label='Email:' value={email} />
      <UserInformationField label='First name:' value={firstName} />
      <UserInformationField label='Last name:' value={lastName} />
      <UserInformationField
        label='Institutional affiliation:'
        value={institution}
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
