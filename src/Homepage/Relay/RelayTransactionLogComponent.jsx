import React, { Component } from 'react';
import { QueryRenderer } from 'react-relay';
import environment from '../../environment';
import Spinner from '../../components/Spinner';
import { graphql } from 'react-relay';
import { Table, TableHead, TableRow, TableColLabel, ColorBar } from '../style';
import TransactionLogRow from './RelayTransactionLogRow';

export class RelayTransactionLogComponent extends Component {
  /**
   *
   * @param {Object} proj
   */
  render() {
    return (<QueryRenderer
      environment={environment}
      query={
        graphql`query RelayTransactionLogComponentQuery {
          transaction_list: transaction_log (last:20) {
            id
            project_id
            created_datetime
            state
          }
        }`
      }
      render={
        ({ error, props }) => {
          if (error) {
            return <div>{error.message}</div>;
          } else if (props && props.transaction_list) {
            return <TransactionLogTable log={props.transaction_list} />;
          }
          return <Spinner />;
        }
      }
    />);
  }
}

export class TransactionLogTable extends React.Component {
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
