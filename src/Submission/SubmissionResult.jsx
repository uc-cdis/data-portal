import React from 'react';
import styled from 'styled-components';
import brace from 'brace'; // needed by AceEditor
import 'brace/mode/json';
import 'brace/theme/kuroir';
import AceEditor from 'react-ace';
import PropTypes from 'prop-types';

import { button } from '../theme';

const Container = styled.div`
border-top: 1px dashed ${props => props.theme.mid_gray};
padding-top: 1em;
margin-top: 1em;
`;

const Status = styled.div`
${button};
background-color: ${props => ((props.status === 200) ? '#168616' : 'gray')};
color: white;
margin-bottom: 1em;
`;

const summaryDivStyle = {
  maxHeight: '250px',
  overflow: 'auto',
};

const summaryListStyle = {
  listStyle: 'disc',
  padding: '0px 0px 25px 25px',
};

/**
 * Present summary of a submission success or failure given
 * the HTTP status code and response data object.
 * 
 * @param {number} status
 * @param {object} data 
 */
const SubmissionResult = ({ status, data }) => {
  let summary = null;

  if (status === 200) {
    // List number of entites of each type created
    const entityType2Count = (data.entities || [])
      .map(ent => ent.type || 'unknown')
      .reduce((db, type) => { db[type] = (db[type] || 0) + 1; return db; }, {});
    summary = (<div id="cd-summary__result_200" style={summaryDivStyle}>
      <p>Successfully created entities:</p>
      <ul style={summaryListStyle}>
        {Object.keys(entityType2Count).sort()
          .map(type => <li key={type}>{entityType2Count[type]} of {type}</li>)}
      </ul>
    </div>);
  } else if (status >= 400 && status < 500) {
    const errorList = (data.entities || []).filter(ent => !!ent.errors);
    if (errorList.length > 0) {
      summary = (<div id="cd-summary__result_400"><p>
          Errors:
      </p>
      <AceEditor
          width="100%"
          height="300px"
          style={{ marginBottom: '2em' }}
          mode="json"
          theme="kuroir"
          readOnly
          value={JSON.stringify(errorList, null, '    ')}
        />
      </div>);
    }
  } else if (status === 504) {
    summary = (<div id="cd-summary__result_504"><p>
      Submission timed out.  Try submitting the data in chunks of 1000 entries or less.
    </p></div>);
  }

  return (
    <Container id="cd-submit-tsv__result">
      <Status status={status}>{status === 200 ? `succeeded: ${status}` : `failed: ${status}`}</Status>
      {summary}
      <p>Full response:</p>
      <AceEditor width="100%" height="300px" style={{ marginBottom: '1em' }} mode="json" theme="kuroir" readOnly value={JSON.stringify(data, null, '    ')} />
    </Container>
  );
};

SubmissionResult.propTypes = {
  status: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
};


export default SubmissionResult;
