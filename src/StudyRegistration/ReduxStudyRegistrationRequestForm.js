import { connect } from 'react-redux';
import StudyRegistrationRequestForm from './GenericRegistrationRequestForm/GenericRegistrationRequestForm';

const mapStateToProps = (state) => ({
  user: state.user,
  userAuthMapping: state.userAuthMapping,
});

const ReduxStudyRegistrationRequestForm = connect(mapStateToProps)(
  StudyRegistrationRequestForm,
);

export default ReduxStudyRegistrationRequestForm;
