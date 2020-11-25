import React from 'react';
import PropTypes from 'prop-types';

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
      <div>Email: {email}</div>
      <div>First name: {firstName || 'N/A'}</div>
      <div>Last name: {lastName || 'N/A'}</div>
      <div>Institutional affiliation: {institution || 'N/A'}</div>
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
