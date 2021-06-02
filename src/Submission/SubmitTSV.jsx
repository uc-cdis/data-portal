import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-kuroir';
import { predictFileType } from '../utils';
import SubmissionResult from './SubmissionResult';
import './SubmitTSV.less';

/**
 * Manage TSV/JSON submission
 *
 * @param {string} project of form program-project
 * @param {Function} onFileChange triggered when user edits something in tsv/json AceEditor
 */
const SubmitTSV = ({
  project,
  submission,
  onUploadClick,
  onSubmitClick,
  onFileChange,
  onFinish,
}) => {
  const fileUploadRef = useRef(null);

  //
  // Reads the bytes from the tsv/json file the user submits,
  // then notify onUploadClick listener which might stuff data
  // into Redux or whatever it wants ...
  //
  const processUpload = (event) => {
    const f = event.target.files[0];
    const reader = new FileReader();
    let fileType = f.type;
    if (f.name.endsWith('.tsv')) {
      fileType = 'text/tab-separated-values';
    }
    reader.onload = (e) => {
      const data = e ? e.target.result : reader.content;
      onUploadClick(data, predictFileType(data, fileType));
    };
    reader.readAsText(f);
  };

  const resetFileBeforeUpdate = (e) => {
    // In chrome we need to reset the file input value so that
    // onChange will be triggered when user upload same file again.
    e.currentTarget.value = null;
  };

  const onSubmitClickEvent = () => {
    onSubmitClick(project);
  };

  const onChange = (newValue) => {
    onFileChange(newValue, submission.file_type);
  };

  const onFinishSubmitEvent = () => {
    onFinish(submission.nodeTypes, project, submission.dictionary);
  };

  return (
    <form>
      <div className='submit-tsv'>
        <label id='cd-submit-tsv__upload-button' htmlFor='file-upload'>
          <input
            ref={fileUploadRef}
            type='file'
            onClick={resetFileBeforeUpdate}
            onChange={processUpload}
            name='file-upload'
            className='submit-tsv__file-upload'
            id='file-upload'
          />
          <span
            className='button-primary-white submit-tsv__upload-button'
            onKeyPress={(e) => {
              if (e.charCode === 13 || e.charCode === 32) {
                e.preventDefault();
                fileUploadRef.current?.click();
              }
            }}
            role='button'
            tabIndex={0}
          >
            Upload file
          </span>
        </label>
        &emsp;
        {submission.file && (
          <button
            type='button'
            className='submit-tsv__upload-button button-primary-white'
            id='cd-submit-tsv__submit-button'
            onClick={onSubmitClickEvent}
            onKeyPress={onSubmitClickEvent}
          >
            Submit
          </button>
        )}
      </div>
      {submission.file && (
        <AceEditor
          width='100%'
          height='200px'
          className='submit-tsv__ace-editor'
          mode={
            submission.file_type === 'text/tab-separated-values' ? '' : 'json'
          }
          theme='kuroir'
          value={submission.file}
          editorProps={{ $blockScrolling: Infinity }} // mutes console warning
          onChange={onChange}
          id='uploaded'
        />
      )}
      {submission.submit_result && (
        <div>
          <p>
            Submitting chunk {submission.submit_counter} of{' '}
            {submission.submit_total}
          </p>
          <SubmissionResult
            status={submission.submit_status}
            data={submission.submit_result}
            dataString={submission.submit_result_string}
            entityCounts={
              'submit_entity_counts' in submission
                ? submission.submit_entity_counts
                : {}
            }
            counter={submission.submit_counter}
            total={submission.submit_total}
            onFinish={onFinishSubmitEvent}
          />
        </div>
      )}
    </form>
  );
};

SubmitTSV.propTypes = {
  project: PropTypes.string.isRequired, // from react-router
  submission: PropTypes.shape({
    file: PropTypes.string,
    file_type: PropTypes.string,
    submit_result: PropTypes.any,
    submit_result_string: PropTypes.string,
    submit_status: PropTypes.number,
    submit_counter: PropTypes.number,
    submit_total: PropTypes.number,
    submit_entity_counts: PropTypes.number,
    nodeTypes: PropTypes.arrayOf(PropTypes.string),
    dictionary: PropTypes.object,
  }),
  onUploadClick: PropTypes.func.isRequired,
  onSubmitClick: PropTypes.func.isRequired,
  onFileChange: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
};

SubmitTSV.defaultProps = {
  submission: {
    submit_counter: 0,
  },
};

export default SubmitTSV;
