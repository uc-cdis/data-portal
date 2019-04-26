import React from 'react';
import brace from 'brace'; // needed by AceEditor
import 'brace/mode/json';
import 'brace/theme/kuroir';
import AceEditor from 'react-ace';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import ReduxDataModelGraph, { getCounts } from '../DataModelGraph/ReduxDataModelGraph';
import './SubmissionResult.less';

/**
 * Present summary of a submission success or failure given
 * the HTTP status code and response data object.
 *
 * @param {number} status
 * @param {object} data
 * @param {string} dataString
 * @param {number} counter
 * @param {number} total
 */
class SubmissionResult extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showFullResponse: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { status, data, dataString, entityCounts, counter, total, onFinish } = this.props;
    if ((counter !== prevProps.counter) && (counter === total)) {
      onFinish();
    }
  }

  render() {
    const { status, data, dataString, entityCounts, counter, total } = this.props;
    let summary = null;
    const fullResponse = (() => {
      if (this.state.showFullResponse) {
        return (
          <div>
            <p>Details:</p>
            <AceEditor width='100%' height='300px' style={{ marginBottom: '1em' }} mode='json' theme='kuroir' readOnly value={dataString} />
          </div>
        );
      }
      return (
        <div>
          <Button
            buttonType='secondary'
            onClick={() => this.setState({ showFullResponse: true })}
            label='Details'
          />
        </div>
      );
    })();

    if (status === 200) {
      // List number of entites of each type created
      summary = (<div id='cd-summary__result_200' className='submission-result__summary'>
        <p>Successfully created entities:</p>
        <ul className='submission-result__list'>
          { Object.keys(entityCounts).sort()
            .map(type => <li key={type}>{entityCounts[type]} of {type}</li>)}
        </ul>
      </div>);
    } else if (status >= 400 && status < 500) {
      const errorList = (data || []).filter(ent => ent.errors && ent.errors.length);
      if (errorList.length > 0) {
        summary = (<div id='cd-summary__result_400'><p>
            Errors:
        </p>
        <AceEditor
          width='100%'
          height='300px'
          style={{ marginBottom: '2em' }}
          mode='json'
          theme='kuroir'
          readOnly
          value={JSON.stringify(errorList, null, '    ')}
        />
        </div>);
      }
    } else if (status === 504) {
      summary = (<div id='cd-summary__result_504'><p>
        Submission timed out.  Try submitting the data in chunks of 1000 entries or less.
      </p></div>);
    }

    return (
      <div className='submission-result' id='cd-submit-tsv__result'>
        <div
          className={`submission-result__status submission-result__status--${status === 200 ? 'succeeded' : 'failed'}`}
          status={status}
        >
          {status === 200 ? `Succeeded: ${status}` : `Failed: ${status}`}
          <p>Submitted chunk {counter} of {total} </p>
        </div>
        {summary}
        {fullResponse}
      </div>
    );
  }
}

SubmissionResult.propTypes = {
  status: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
  dataString: PropTypes.string.isRequired,
  entityCounts: PropTypes.object.isRequired,
  counter: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onFinish: PropTypes.func.isRequired,
};

export default SubmissionResult;
