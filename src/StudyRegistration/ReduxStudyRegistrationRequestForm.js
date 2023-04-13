import { connect } from 'react-redux';
import GenericAccessRequestForm from '../GenericAccessRequestForm/GenericAccessRequestForm';

const mapStateToProps = (state) => ({
  user: state.user,
  userAuthMapping: state.userAuthMapping,
});

const ReduxStudyRegistrationRequestForm = connect(mapStateToProps)(
  GenericAccessRequestForm
);

export default ReduxStudyRegistrationRequestForm;
