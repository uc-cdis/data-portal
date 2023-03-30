import { connect } from 'react-redux';
import GenericRegistrationRequestForm from './GenericRegistrationRequestForm/GenericRegistrationRequestForm';

const mapStateToProps = (state) => ({
  user: state.user,
  userAuthMapping: state.userAuthMapping,
});

const ReduxStudyRegistrationRequestForm = connect(mapStateToProps)(
  GenericRegistrationRequestForm,
);

export default ReduxStudyRegistrationRequestForm;
