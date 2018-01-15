import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import {TableRow, TableCell, ColorSpan, ColorBar} from '../style';

const SuccessBar = styled(ColorBar)`
  background: #004499;
`;

const FailBar = styled(ColorBar)`
  background: #ff2200;
`;

const PendingBar = styled(ColorBar)`
  background: #aa6600;
`;

const getLocalTime = (gmtTimeString) => {
  const date = new Date(gmtTimeString);
  const offsetMins = date.getTimezoneOffset();
  const offsetHous = -offsetMins / 60;
  return `${date.toLocaleString()} UTC${(offsetMins > 0) ? '' : '+'}${offsetHous}`;
};

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
          {(trans.state === 'SUCCEEDED' && <SuccessBar><ColorSpan >{trans.state}</ColorSpan></SuccessBar>)
          || ((trans.state === 'FAILED' || trans.state === 'ERRORED') && <FailBar><ColorSpan >{trans.state}</ColorSpan></FailBar>)
          || (trans.state === 'PENDING' && <PendingBar><ColorSpan >{trans.state}</ColorSpan></PendingBar>)
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
        {(trans.state === 'SUCCEEDED' && <SuccessBar><ColorSpan >{trans.state}</ColorSpan></SuccessBar>)
        || ((trans.state === 'FAILED' || trans.state === 'ERRORED') && <FailBar><ColorSpan >{trans.state}</ColorSpan></FailBar>)
        || (trans.state === 'PENDING' && <PendingBar><ColorSpan >{trans.state}</ColorSpan></PendingBar>)
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
export default TransactionLogRow
