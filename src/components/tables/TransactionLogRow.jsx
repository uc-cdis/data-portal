import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { TableRow, TableCell } from './style';

const StatusBar = styled.div`
  font-size: 16px;
  text-align: left;
`;

const FailBar = styled(StatusBar)`
  color: #ff2200;
`;

const PendingBar = styled(StatusBar)`
  color: #ffffff;
`;

const getLocalTime = (gmtTimeString) => {
  const date = new Date(gmtTimeString);
  const offsetMins = date.getTimezoneOffset();
  const offsetHous = -offsetMins / 60;
  return `${date.toLocaleString()} UTC${(offsetMins > 0) ? '' : '+'}${offsetHous}`;
};

const formatText = text => text[0] + text.slice(1).toLowerCase();

/**
 * Table row component - fills in columns given project property
 */
export class TransactionLogTR extends React.Component {
  render() {
    const trans = this.props.transaction;
    if (this.props.idx % 2 === 1) {
      return (<TableRow oddRow>
        <TableCell>{trans.id}
        </TableCell>
        <TableCell>{trans.project_id}
        </TableCell>
        <TableCell>{getLocalTime(trans.created_datetime)}
        </TableCell>
        <TableCell>
          {
            (trans.state === 'SUCCEEDED' && <StatusBar className="special-number">{formatText(trans.state)}</StatusBar>)
          || ((trans.state === 'FAILED' || trans.state === 'ERRORED') && <FailBar className="special-number">{formatText(trans.state)}</FailBar>)
          || (trans.state === 'PENDING' && <PendingBar className="special-number">{formatText(trans.state)}</PendingBar>)
          }
        </TableCell>
      </TableRow>);
    }
    return (<TableRow>
      <TableCell>{trans.id}
      </TableCell>
      <TableCell>{trans.project_id}
      </TableCell>
      <TableCell>{getLocalTime(trans.created_datetime)}
      </TableCell>
      <TableCell>
        {
          (trans.state === 'SUCCEEDED' && <StatusBar className="special-number">{formatText(trans.state)}</StatusBar>)
          || ((trans.state === 'FAILED' || trans.state === 'ERRORED') && <FailBar className="special-number">{formatText(trans.state)}</FailBar>)
          || (trans.state === 'PENDING' && <PendingBar className="special-number">{formatText(trans.state)}</PendingBar>)
        }
      </TableCell>
    </TableRow>);
  }
}

TransactionLogTR.propTypes = {
  transaction: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
};

const TransactionLogRow = TransactionLogTR;
export default TransactionLogRow;
