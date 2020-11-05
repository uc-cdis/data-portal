import { connect } from 'react-redux';
import VAGWASMockup from './VAGWASMockup';

export const submitFile = value => (dispatch) => {
  dispatch({
    type: 'UPLOAD_PC_FILE',
    file: value,
  });
};

export const removeFile = () => (dispatch) => {
  dispatch({
    type: 'REMOVE_PC_FILE',
  });
};

const mapStateToProps = state => ({
  pcFile: state.analysis.pcFile,
});

const mapDispatchToProps = dispatch => ({
  onUploadClick: value => dispatch(submitFile(value)),
  onRemoveClick: () => dispatch(removeFile()),
});

const ReduxVAGWASMockup = connect(mapStateToProps, mapDispatchToProps)(VAGWASMockup);
export default ReduxVAGWASMockup;
