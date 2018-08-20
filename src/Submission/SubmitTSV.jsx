import React from 'react';
import brace from 'brace'; // needed by AceEditor
import 'brace/mode/json';
import 'brace/theme/kuroir';
import AceEditor from 'react-ace';
import PropTypes from 'prop-types';
import { predictFileType } from '../utils';
import SubmissionResult from './SubmissionResult';
import './SubmitTSV.less';

/**
 * Manage TSV/JSON submission
 *
 * @param {string} project of form program-project
 * @param {Function} onFileChange triggered when user edits something in tsv/json AceEditor
 */
const SubmitTSV = ({ project, submission, onUploadClick, onSubmitClick, onFileChange }) => {
  //
  // Reads the bytes from the tsv/json file the user submits,
  // then notify onUploadClick listener which might stuff data
  // into Redux or whatever it wants ...
  //
  const processUpload = (event) => {
    const f = event.target.files[0];
    if (FileReader.prototype.readAsBinaryString === undefined) {
      FileReader.prototype.readAsBinaryString = (fileData) => {
        let binary = '';
        const pt = this;
        const reader = new FileReader();
        // listener for when all the bytes have been read
        //  https://developer.mozilla.org/en-US/docs/Web/API/FileReader
        reader.onload = () => {
          const bytes = new Uint8Array(reader.result);
          const length = bytes.byteLength;
          for (let i = 0; i < length; i += 1) {
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
    reader.onload = (e) => {
      const data = e ? e.target.result : reader.content;
      onUploadClick(data, predictFileType(data, fileType));
    };
    reader.readAsBinaryString(f);
  };

  const onSubmitClickEvent = () => {
    onSubmitClick(submission.nodeTypes, project, submission.dictionary);
  };

  const onChange = (newValue) => {
    onFileChange(newValue, submission.file_type);
  };

  return (
    <form>
      <div className='submit-tsv'>
        <label
          className='button-primary-white submit-tsv__upload-button'
          id='cd-submit-tsv__upload-button'
          htmlFor='file-upload'
        >
          <input
            type='file'
            onChange={processUpload}
            name='file-upload'
            className='submit-tsv__file-upload'
            id='file-upload'
          />
          Upload file
        </label>
        &emsp;
        {submission.file &&
          <button
            type='button'
            className='submit-tsv__upload-button button-primary-white'
            id='cd-submit-tsv__submit-button'
            onClick={onSubmitClickEvent}
            onKeyPress={onSubmitClickEvent}
          >
            Submit
          </button>
        }

      </div>
      { (submission.file) &&
      <AceEditor
        width='100%'
        height='200px'
        className='submit-tsv__ace-editor'
        mode={submission.file_type === 'text/tab-separated-values' ? '' : 'json'}
        theme='kuroir'
        value={submission.file}
        editorProps={{ $blockScrolling: Infinity }} // mutes console warning
        onChange={onChange}
        id='uploaded'
      />
      }
      {submission.submit_result &&
      <SubmissionResult status={submission.submit_status} data={submission.submit_result} />
      }
    </form>
  );
};

SubmitTSV.propTypes = {
  project: PropTypes.string.isRequired, // from react-router
  submission: PropTypes.shape({
    file: PropTypes.string,
    file_type: PropTypes.string,
    submit_result: PropTypes.any,
    submit_status: PropTypes.number,
    node_types: PropTypes.string,
    dictionary: PropTypes.object,
  }),
  onUploadClick: PropTypes.func.isRequired,
  onSubmitClick: PropTypes.func.isRequired,
  onFileChange: PropTypes.func.isRequired,
};

SubmitTSV.defaultProps = {
  submission: {},
};

export default SubmitTSV;
