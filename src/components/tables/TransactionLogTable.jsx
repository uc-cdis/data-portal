import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, TableHead, TableColLabel } from './style';
import TransactionLogRow from './TransactionLogRow';
import Spinner from '../Spinner';

class TransactionLogTable extends Component {
  render() {
    if (!this.props.log || this.props.log === []) { return <Spinner />; }
    return (
      <div>
        <h2>Recent Submissions</h2>
        <Table>
          <TableHead>
            <tr>
              <TableColLabel>Id</TableColLabel>
              <TableColLabel>Project</TableColLabel>
              <TableColLabel>Created date</TableColLabel>
              <TableColLabel>State</TableColLabel>
            </tr>
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
