import { connect } from 'react-redux';
import GenericAccessRequestForm from './GenericAccessRequestForm';

const mapStateToProps = (state) => ({
  user: state.user,
  userAuthMapping: state.userAuthMapping,
});

const ReduxGenericAccessRequestForm = connect(mapStateToProps)(
  GenericAccessRequestForm
);

export default ReduxGenericAccessRequestForm;
