import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-kuroir';
import Button from '../gen3-ui-component/components/Button';
import './SubmissionResult.css';

/**
 * Present summary of a submission success or failure given
 * the HTTP status code and response data object.
 *
 * @param {Object} props
 * @param {number} props.counter
 * @param {any} props.data
 * @param {string} props.dataString
 * @param {{ [x: string]: number }} props.entityCounts
 * @param {() => void} props.onFinish
 * @param {number} props.status
 * @param {number} props.total
 */
function SubmissionResult({
  counter,
  data,
  dataString,
  entityCounts,
  onFinish,
  status,
  total,
}) {
  useEffect(() => {
    if (total > 0 && counter === total) onFinish();
  }, [counter, total]);

  const [showFullResponse, setShowFullResponse] = useState(false);

  let summary = null;
  if (status === 200)
    // List number of entites of each type created
    summary = (
      <div id='cd-summary__result_200' className='submission-result__summary'>
        <p>Successfully created entities:</p>
        <ul className='submission-result__list'>
          {Object.keys(entityCounts)
            .sort()
            .map((type) => (
              <li key={type}>
                {entityCounts[type]} of {type}
              </li>
            ))}
        </ul>
      </div>
    );
  else if (status >= 400 && status < 500 && Array.isArray(data)) {
    const errorList = data.filter((ent) => ent.errors && ent.errors.length);
    if (errorList.length > 0) {
      summary = (
        <div id='cd-summary__result_400'>
          <p>Errors:</p>
          <AceEditor
            width='100%'
            height='300px'
            style={{ marginBottom: '2em' }}
            mode='json'
            theme='kuroir'
            readOnly
            value={JSON.stringify(errorList, null, '    ')}
          />
        </div>
      );
    }
  } else if (status === 504)
    summary = (
      <div id='cd-summary__result_504'>
        <p>
          Submission timed out. Try submitting the data in chunks of 1000
          entries or less.
        </p>
      </div>
    );

  return (
    <div className='submission-result' id='cd-submit-tsv__result'>
      <div
        className={`submission-result__status submission-result__status--${
          status === 200 ? 'succeeded' : 'failed'
        }`}
      >
        {status === 200 ? `Succeeded: ${status}` : `Failed: ${status}`}
        <p>
          Submitted chunk {counter} of {total}{' '}
        </p>
      </div>
      {summary}
      {showFullResponse ? (
        <div>
          <p>Details:</p>
          <AceEditor
            width='100%'
            height='300px'
            style={{ marginBottom: '1em' }}
            mode='json'
            theme='kuroir'
            readOnly
            value={dataString}
          />
        </div>
      ) : (
        <div>
          <Button
            buttonType='secondary'
            onClick={() => setShowFullResponse(true)}
            label='Details'
          />
        </div>
      )}
    </div>
  );
}

SubmissionResult.propTypes = {
  counter: PropTypes.number.isRequired,
  data: PropTypes.any.isRequired,
  dataString: PropTypes.string.isRequired,
  entityCounts: PropTypes.objectOf(PropTypes.number).isRequired,
  onFinish: PropTypes.func.isRequired,
  status: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default SubmissionResult;
