import { connect } from 'react-redux';
import SubmitForm from './SubmitForm';
import { requestUpload, updateFormSchema } from '../redux/submission/slice';

/** @typedef {import('../redux/types').RootState} RootState */

/** @param {RootState} state */
const mapStateToProps = (state) => ({
  submission: state.submission,
});

/** @param {import('../redux/types').AppDispatch} dispatch */
const mapDispatchToProps = (dispatch) => ({
  /**
   * @param {RootState['submission']['file']} file
   * @param {RootState['submission']['file_type']} fileType
   */
  onUploadClick: (file, fileType) =>
    dispatch(requestUpload({ file, file_type: fileType })),
  /**
   * @param {RootState['submission']['formSchema']} formSchema
   */
  onUpdateFormSchema: (formSchema) => dispatch(updateFormSchema(formSchema)),
});

const ReduxSubmitForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(SubmitForm);
export default ReduxSubmitForm;
