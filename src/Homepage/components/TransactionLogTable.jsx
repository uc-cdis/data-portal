import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, TableHead, TableRow, TableColLabel } from '../style';
import TransactionLogRow from './TransactionLogRow';

class TransactionLogTable extends Component {
  render() {
    return (
      <div>
        <h2>Recent Submissions</h2>
        <Table>
          <TableHead>
            <TableColLabel>Id</TableColLabel>
            <TableColLabel>Project</TableColLabel>
            <TableColLabel>Created date</TableColLabel>
            <TableColLabel>State</TableColLabel>
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
