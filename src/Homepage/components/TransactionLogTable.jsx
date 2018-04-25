import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, TableHead, TableRow, TableColLabel } from '../style';
import TransactionLogRow from './TransactionLogRow';

class TransactionLogTable extends Component {
  render() {
    return (
      <div>
        <h5>Recent Submissions</h5>
        <Table>
          <TableHead>
            <TableRow key="header">
              <TableColLabel>Id</TableColLabel>
              <TableColLabel>Project</TableColLabel>
              <TableColLabel>Created date</TableColLabel>
              <TableColLabel>State</TableColLabel>
            </TableRow>
          </TableHead>
          <tbody>
            {
              this.props.log.map(
                (trans, i) => <TransactionLogRow key={trans.id} idx={i} transaction={trans} />,
              )
            }
          </tbody>
        </Table>
      </div>
    );
  }
}

TransactionLogTable.propTypes = {
  log: PropTypes.array.isRequired,
};

export default TransactionLogTable;
