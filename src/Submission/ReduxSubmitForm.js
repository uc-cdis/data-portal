import { connect } from 'react-redux';
import SubmitForm from './SubmitForm';
import { uploadTSV, updateFormSchema } from './actions';

const mapStateToProps = (state) => ({
  submission: state.submission,
});

const mapDispatchToProps = (dispatch) => ({
  onUploadClick: (value, type) => dispatch(uploadTSV(value, type)),
  onUpdateFormSchema: (formSchema) => dispatch(updateFormSchema(formSchema)),
});

const ReduxSubmitForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(SubmitForm);
export default ReduxSubmitForm;
