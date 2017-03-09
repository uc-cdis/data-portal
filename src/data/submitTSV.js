import React from 'react';
import brace from 'brace';
import 'brace/mode/json';
import 'brace/theme/kuroir';
import AceEditor from 'react-ace';
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
  background-color: ${props => (props.status == 'succeed: 200') ? '#168616' : 'gray'};
  color: white;
  margin-bottom: 1em;
`;

const SubmitTSVComponent = ({ path, submission, onUploadClick, onSubmitClick, onFileChange }) => {
  let setValue = (event) => {
    let f = event.target.files[0];
    let reader = new FileReader();
    let file_type = f.type;
    console.log(f);
    if (f.name.endsWith('.tsv')){
      file_type = 'text/tab-separated-values';
    }
    console.log(file_type);
    reader.readAsBinaryString(f);
    reader.onload = ((e) => onUploadClick(e.target.result, file_type));
  }
  let onSubmitClickEvent = () => {
    onSubmitClick();
  }
  let onChange = (newValue) => {
    onFileChange(newValue);
  }
  return (
    <form>
      <input type='file' onChange={setValue} name='file-upload' style={{display:'none'}} id='file-upload'/>
      <SubmitButton htmlFor='file-upload'>Upload file</SubmitButton>
     {submission.file &&
        <UploadButton onClick={onSubmitClickEvent}>Submit</UploadButton>
     }
     { (submission.file || path == 'graphql') &&
      <AceEditor width="100%" height="200px" mode={submission.file_type=='text/tab-separated-values'? '' : 'json'} theme="kuroir" value={submission.file} onChange={onChange} id='uploaded'/>
     }
     {submission.submit_result &&
      <SubmissionResult>
        <Status status={submission.submit_status}>{submission.submit_status}</Status>
       <AceEditor width="100%" height="300px"  mode="json" theme="kuroir" readOnly={true} value={JSON.stringify(submission.submit_result, null, '    ')} />
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
