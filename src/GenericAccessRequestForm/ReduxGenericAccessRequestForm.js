import { connect } from 'react-redux';
import GenericAccessRequestForm from './GenericAccessRequestForm';
import { components } from '../params';

const mapStateToProps = (state) => ({
  user: state.user,
  userAuthMapping: state.userAuthMapping,
  supportEmail: components.login.email,
});

const ReduxGenericAccessRequestForm = connect(mapStateToProps)(
  GenericAccessRequestForm
);

export default ReduxGenericAccessRequestForm;
