import React from 'react';
import { connect } from 'react-redux';
import StudyRegistrationRequestForm from './StudyRegistrationRequestForm';

const mapStateToProps = (state) => ({
  user: state.user,
  userAuthMapping: state.userAuthMapping,
  formText: 'lol'
});

const ReduxStudyRegistrationRequestForm =
  connect(mapStateToProps)(StudyRegistrationRequestForm);

export default ReduxStudyRegistrationRequestForm;
