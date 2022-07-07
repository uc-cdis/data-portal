import { connect } from 'react-redux';
import StudyRegistrationRequestForm from './StudyRegistrationRequestForm';

export const ReduxStudyRegistrationRequestForm = (() => {
  const mapStateToProps = (state) => ({
    user: state.user,
    userAuthMapping: state.userAuthMapping,
  });

  return connect(mapStateToProps)(StudyRegistrationRequestForm);
})();
