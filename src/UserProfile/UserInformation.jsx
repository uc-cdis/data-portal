import React from 'react';
import PropTypes from 'prop-types';
import SimpleInputField from '../components/SimpleInputField';

/**
 * @param {Object} props
 * @param {string} props.email
 * @param {string} [props.firstName]
 * @param {string} [props.lastName]
 * @param {string} [props.institution]
 */
function UserInformation({ email, firstName, lastName, institution }) {
  return (
    <div>
      <h2>Your information</h2>
      <SimpleInputField
        label='Email:'
        input={<input readOnly value={email} />}
      />
      <SimpleInputField
        label='First name:'
        input={<input readOnly value={firstName || 'N/A'} />}
      />
      <SimpleInputField
        label='Last name:'
        input={<input readOnly value={lastName || 'N/A'} />}
      />
      <SimpleInputField
        label='Institutional affiliation:'
        input={<input readOnly value={institution || 'N/A'} />}
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
