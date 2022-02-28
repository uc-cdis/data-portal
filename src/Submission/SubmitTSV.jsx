import { useRef } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-kuroir';
import useSessionMonitor from '../hooks/useSessionMonitor';
import { predictFileType } from '../utils';
import SubmissionResult from './SubmissionResult';
import { SubmissionStateType } from './propTypeDef';
import './SubmitTSV.css';

/**
 * @typedef {Object} SubmissionState
 * @property {Object} [dictionary]
 * @property {string} [file]
 * @property {string} [file_type]
 * @property {string[]} [nodeTypes]
 * @property {number} [submit_counter]
 * @property {{ [x: string]: number }} [submit_entity_counts]
 * @property {any} [submit_result]
 * @property {string} [submit_result_string]
 * @property {number} [submit_status]
 * @property {number} [submit_total]
 */

/**
 * Manage TSV/JSON submission
 * @param {Object} props
 * @param {string} props.project of form program-project
 * @param {SubmissionState} props.submission
 * @param {(file: string, fileType: string) => void} props.onFileChange triggered when user edits something in tsv/json AceEditor
 * @param {(project: string) => void} props.onFinish
 * @param {(file: string, fileType: string) => void} props.onUploadClick
 * @param {(project: string, callback?: () => void) => void} props.onSubmitClick
 */
function SubmitTSV({
  project,
  submission = { submit_counter: 0 },
  onFileChange,
  onFinish,
  onSubmitClick,
  onUploadClick,
}) {
  const fileUploadRef = useRef(null);

  /**
   * Reads the bytes from the tsv/json file the user submits,
   * then notify onUploadClick listener which might stuff data
   * into Redux or whatever it wants ...
   * @type {React.ChangeEventHandler<HTMLInputElement>}
   */
  function processUpload(e) {
    const file = e.target.files[0];
    const fileType = file.name.endsWith('.tsv')
      ? 'text/tab-separated-values'
      : file.type;

    const reader = new FileReader();
    reader.onload = ({ target }) => {
      const data = /** @type {string} */ (target.result);
      onUploadClick(data, predictFileType(data, fileType));
    };
    reader.readAsText(file);
  }

  /**
   * In chrome we need to reset the file input value so that
   * onChange will be triggered when user upload same file again.
   * @type {React.MouseEventHandler<HTMLInputElement>}
   */
  function resetFileBeforeUpdate(e) {
    e.currentTarget.value = null;
  }

  const sessionMonitor = useSessionMonitor();
  function handleSubmitFile() {
    onSubmitClick(project, () => sessionMonitor.updateUserActivity());
  }

  /** @param {string} value */
  function handleAceEditorChange(value) {
    onFileChange(value, submission.file_type);
  }

  function handleFinishSubmit() {
    onFinish(project);
  }

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
            aria-label='Upload file'
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
            onClick={handleSubmitFile}
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
          onChange={handleAceEditorChange}
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
            entityCounts={submission.submit_entity_counts ?? {}}
            counter={submission.submit_counter}
            total={submission.submit_total}
            onFinish={handleFinishSubmit}
          />
        </div>
      )}
    </form>
  );
}

SubmitTSV.propTypes = {
  project: PropTypes.string.isRequired, // from react-router
  submission: SubmissionStateType.isRequired,
  onFileChange: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  onSubmitClick: PropTypes.func.isRequired,
  onUploadClick: PropTypes.func.isRequired,
};

export default SubmitTSV;
