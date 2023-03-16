import React from 'react';
import { connect } from 'react-redux';
import StudyRegistrationRequestForm from './StudyRegistrationRequestForm/StudyRegistrationRequestForm';

const mapStateToProps = (state) => ({
  user: state.user,
  userAuthMapping: state.userAuthMapping,
});

const ReduxStudyRegistrationRequestForm =
  connect(mapStateToProps)(StudyRegistrationRequestForm);

export default ReduxStudyRegistrationRequestForm;
