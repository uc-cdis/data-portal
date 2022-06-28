import { connect } from 'react-redux';
import SubmitForm from './SubmitForm';
import { requestUpload, updateFormSchema } from './actions';

/** @typedef {import('./types').SubmissionState} SubmissionState */

/** @param {{ submission: SubmissionState }} state */
const mapStateToProps = (state) => ({
  submission: state.submission,
});

/** @param {import('redux-thunk').ThunkDispatch} dispatch */
const mapDispatchToProps = (dispatch) => ({
  /**
   * @param {SubmissionState['file']} file
   * @param {SubmissionState['file_type']} fileType
   */
  onUploadClick: (file, fileType) =>
    dispatch(requestUpload({ file, file_type: fileType })),
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
