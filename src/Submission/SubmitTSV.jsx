import React from 'react';
import styled from 'styled-components';
import brace from 'brace'; // needed by AceEditor
import 'brace/mode/json';
import 'brace/theme/kuroir';
import AceEditor from 'react-ace';
import PropTypes from 'prop-types';

import { predictFileType } from '../utils';
import { button, UploadButton, SubmitButton } from '../theme';


const SubmissionResult = styled.div`
  border-top: 1px dashed ${props => props.theme.mid_gray};
  padding-top: 1em;
  margin-top: 1em;
`;
const Status = styled.div`
  ${button};
  background-color: ${props => ((props.status === 'succeed: 200') ? '#168616' : 'gray')};
  color: white;
  margin-bottom: 1em;
`;

const SubmitTSV = ({ path, submission, onUploadClick, onSubmitClick, onFileChange }) => {
  const setValue = (event) => {
    const f = event.target.files[0];
    if (FileReader.prototype.readAsBinaryString === undefined) {
      FileReader.prototype.readAsBinaryString = function (fileData) {
        let binary = '';
        const pt = this;
        const reader = new FileReader();
        reader.onload = function () {
          const bytes = new Uint8Array(reader.result);
          const length = bytes.byteLength;
          for (let i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          // pt.result  - readonly so assign content to another property
          pt.content = binary;
          pt.onload();
        };
        reader.readAsArrayBuffer(fileData);
      };
    }
    const reader = new FileReader();
    let fileType = f.type;
    if (f.name.endsWith('.tsv')) {
      fileType = 'text/tab-separated-values';
    }
    reader.onload = function (e) {
      const data = e ? e.target.result : reader.content;
      onUploadClick(data, predictFileType(data, fileType));
    };
    reader.readAsBinaryString(f);
  };
  const onSubmitClickEvent = () => {
    onSubmitClick(submission.nodeTypes, path, submission.dictionary);
  };
  const onChange = (newValue) => {
    onFileChange(newValue, submission.file_type);
  };
  return (
    <form>
      <input type="file" onChange={setValue} name="file-upload" style={{ display: 'none' }} id="file-upload" />
      <UploadButton htmlFor="file-upload">Upload file</UploadButton>
      {submission.file &&
      <SubmitButton onClick={onSubmitClickEvent}>Submit</SubmitButton>
      }
      { (submission.file) &&
      <AceEditor
        width="100%"
        height="200px"
        style={{ marginBottom: '1em' }}
        mode={submission.file_type === 'text/tab-separated-values' ? '' : 'json'}
        theme="kuroir"
        value={submission.file}
        onChange={onChange}
        id="uploaded"
      />
      }
      {submission.submit_result &&
      <SubmissionResult>
        <Status status={submission.submit_status}>{submission.submit_status}</Status>
        <AceEditor width="100%" height="300px" style={{ marginBottom: '1em' }} mode="json" theme="kuroir" readOnly value={JSON.stringify(submission.submit_result, null, '    ')} />
      </SubmissionResult>
      }
    </form>
  );
};

SubmitTSV.propTypes = {
  path: PropTypes.string.isRequired,
  submission: PropTypes.object.isRequired,
  onUploadClick: PropTypes.func.isRequired,
  onSubmitClick: PropTypes.func.isRequired,
  onFileChange: PropTypes.func.isRequired,
};

export default SubmitTSV;
