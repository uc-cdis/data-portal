import React from 'react';
import { predict_file_type } from '../utils';
import brace from 'brace';
import 'brace/mode/json';
import 'brace/theme/kuroir';
import AceEditor from 'react-ace';
import { uploadTSV, submitToServer, updateFileContent } from './actions';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { getCounts } from '../DataModelGraph/actions';
import { button, UploadButton, SubmitButton } from '../theme'


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

const SubmitTSVComponent = ({ path, submission, onUploadClick, onSubmitClick, onFileChange, dictionary }) => {
  let setValue = (event) => {
    let f = event.target.files[0];
    if (FileReader.prototype.readAsBinaryString === undefined) {
      FileReader.prototype.readAsBinaryString = function (fileData) {
        var binary = "";
        var pt = this;
        var reader = new FileReader();
        reader.onload = function (e) {
          var bytes = new Uint8Array(reader.result);
          var length = bytes.byteLength;
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          //pt.result  - readonly so assign content to another property
          pt.content = binary;
          pt.onload();
        }
        reader.readAsArrayBuffer(fileData);
      }
    }
    let reader = new FileReader();
    let file_type = f.type;
    if (f.name.endsWith('.tsv')){
      file_type = 'text/tab-separated-values';
    }
    reader.onload = function (e) {
      if (e === undefined) {
        var data = reader.content;
      } else {
        var data = e.target.result;
      }
      onUploadClick(data, predict_file_type(data, file_type));
    };
    reader.readAsBinaryString(f);
  };
  let onSubmitClickEvent = () => {
    onSubmitClick(submission.node_types, path, submission.dictionary);
  };
  let onChange = (newValue) => {
    onFileChange(newValue, submission.file_type);
  };
  return (
    <form>
      <input type='file' onChange={setValue} name='file-upload' style={{display:'none'}} id='file-upload'/>
      <UploadButton htmlFor='file-upload'>Upload file</UploadButton>
     {submission.file &&
        <SubmitButton onClick={onSubmitClickEvent}>Submit</SubmitButton>
     }
     { (submission.file || path == 'graphql') &&
      <AceEditor width="100%" height="200px" style={{"marginBottom":"1em"}} mode={submission.file_type=='text/tab-separated-values'? '' : 'json'} theme="kuroir" value={submission.file} onChange={onChange} id='uploaded'/>
     }
     {submission.submit_result &&
      <SubmissionResult>
        <Status status={submission.submit_status}>{submission.submit_status}</Status>
       <AceEditor width="100%" height="300px" style={{"marginBottom":"1em"}} mode="json" theme="kuroir" readOnly={true} value={JSON.stringify(submission.submit_result, null, '    ')} />
      </SubmissionResult>
     }
    </form>
  )
};

const mapStateToProps = (state) => {
  return {
    'submission': state.submission,
    'dictionary': state.dictionary
  }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onUploadClick: (value, type) => dispatch(uploadTSV(value, type)),
        onSubmitClick: (type, project, dictionary) => dispatch(submitToServer()).then(() => {dispatch(getCounts(type, project, dictionary))}),
      // To re-render the graph when new data is submitted, need to change the 
      // counts that are stored in the state. A call to getCounts is made
      // after the data is submitted to the database to query the database for
      // the updated count info
        onFileChange: (value) => dispatch(updateFileContent(value)),
    }
};

let SubmitTSV = connect(mapStateToProps, mapDispatchToProps)(SubmitTSVComponent);
export default SubmitTSV;
