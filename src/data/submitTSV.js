import React from 'react';
import brace from 'brace';
import 'brace/mode/json';
import 'brace/theme/kuroir';
import AceEditor from 'react-ace';
import Highlight from 'react-highlight';
import { uploadTSV, submitToServer, updateFileContent } from './submitActions';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { button } from '../theme'

const SubmitButton = styled.label`
  border: 1px solid darkgreen;
  color: darkgreen;
  margin-bottom: 1em;
  &:hover,
  &:active,
  &:focus {
    color: #2e842e;
    border-color: #2e842e;

  }
  ${button};
`;

const UploadButton = styled.a`
  border: 1px solid ${props => props.theme.color_primary};
  color: ${props => props.theme.color_primary};
  margin-bottom: 1em;
  ${button};
  &:hover,
  &:active,
  &:focus {
    color: #c16161;
    border-color: #c16161;

  }

`;

const SubmissionResult = styled.div`
  border-top: 1px dashed ${props => props.theme.mid_gray};
  padding-top: 1em;
  margin-top: 1em;
`;
const Status = styled.div`
  ${button};
  background-color: ${props => (props.status == 'succeed: 200') ? 'darkgreen' : 'gray'};
  color: white;
  margin-bottom: 1em;
`;

const SubmitTSVComponent = ({ submission, onUploadClick, onSubmitClick, onFileChange }) => {
  let setValue = (event) => {
    console.log(event.target.files);

    let f = event.target.files[0];
    let reader = new FileReader();
    reader.readAsBinaryString(f);
    reader.onload = ((e) => onUploadClick(e.target.result, f.type));
  }
  let onSubmitClickEvent = () => {
    onSubmitClick();
  }
  let onChange = (newValue) => {
    onFileChange(newValue);
  }
  console.log(submission);
  return (
    <form>
      <input type='file' onChange={setValue} name='file-upload' style={{display:'none'}} id='file-upload'/>
      <SubmitButton htmlFor='file-upload'>Upload file</SubmitButton>
     {submission.file &&
        <UploadButton onClick={onSubmitClickEvent}>Submit</UploadButton>
     }
      <AceEditor height="200px" mode="json" theme="kuroir" value={submission.file} onChange={onChange} id='uploaded'/>
     {submission.submit_result &&
      <SubmissionResult>
        <Status status={submission.submit_status}>{submission.submit_status}</Status>
        <Highlight >{JSON.stringify(submission.submit_result, null, '    ')}</Highlight>
      </SubmissionResult>
     }
    </form>
  )
}

const mapStateToProps = (state) => {
  return {
    'submission': state.submission
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onUploadClick: (value, type) => dispatch(uploadTSV(value, type)),
        onSubmitClick: () => dispatch(submitToServer()),
        onFileChange: (value) => dispatch(updateFileContent(value)),
    }
}


let SubmitTSV = connect(mapStateToProps, mapDispatchToProps)(SubmitTSVComponent);
export default SubmitTSV;
