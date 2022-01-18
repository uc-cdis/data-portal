import { connect } from 'react-redux';
import SubmitForm from './SubmitForm';
import { uploadTSV, updateFormSchema } from './actions';

/** @typedef {import('./types').SubmissionState} SubmissionState */

/** @param {{ submission: SubmissionState }} state */
const mapStateToProps = (state) => ({
  submission: state.submission,
});

/** @param {import('redux-thunk').ThunkDispatch} dispatch */
const mapDispatchToProps = (dispatch) => ({
  /**
   * @param {SubmissionState['file']} value
   * @param {SubmissionState['file_type']} type
   */
  onUploadClick: (value, type) => dispatch(uploadTSV(value, type)),
  /**
   * @param {SubmissionState['formSchema']} formSchema
   */
  onUpdateFormSchema: (formSchema) => dispatch(updateFormSchema(formSchema)),
});

const ReduxSubmitForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(SubmitForm);
export default ReduxSubmitForm;
