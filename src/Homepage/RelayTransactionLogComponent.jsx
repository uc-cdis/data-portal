import React, {Component} from 'react';
import { QueryRenderer } from 'react-relay';
import environment from '../environment';
import Spinner from '../components/Spinner';
import { app } from '../localconf';
import {graphql} from 'react-relay';
import styled from "styled-components";
import { TableBarColor } from '../theme';

export const Table = styled.table`
  border-collapse: collapse;
  border: 1px solid #dedede;
  overflow: auto;
  margin: 1em 0em;
  text-align:center;
  width:100%;
`;

export const TableHead = styled.thead`
  background: ${TableBarColor};
  color: white;
`;

export const TableRow = styled.tr`
  padding: 0rem 0rem;
  border-bottom: 1px solid #dedede;
  color: #222;
  ${
  props => (props.summaryRow ? `
      background-color: #eeeeee;
      ` : '')
  }
`;


export const TableCell = styled.td`
    color: #222;
    padding: 0.5rem 1rem;
`;

export const TableColLabel = styled.th`
    color: white;
    padding: 0.5rem 1rem;
    height: 100%;
    font-weight: normal;
    text-align:center;
`;

export class RelayTransactionLogComponent extends Component{
  /**
   *
   * @param {Object} proj
   */
  render() {
    return (<QueryRenderer
      environment={environment}
      query={
        graphql`query RelayTransactionLogComponentQuery {
          transaction_list: transaction_log (last:100) {
            id
            committed_by
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

/**
 * Table row component - fills in columns given project property
 */
export class TransactionLogTR extends React.Component {
  render() {
    const trans = this.props.transaction;
    return (<TableRow summaryRow={!! this.props.summaryRow}>
      <TableCell>{trans.id}
      </TableCell>
      <TableCell>{trans.committed_by}
      </TableCell>
      <TableCell>{trans.created_datetime}
      </TableCell>
      <TableCell>
        {trans.state}
      </TableCell>
    </TableRow>);
  }
}

export class TransactionLogTable extends React.Component {
  render() {
    return (
      <Table>
        <TableHead>
          <TableRow key='header'>
            <TableColLabel>Id</TableColLabel>
            <TableColLabel>Committed By</TableColLabel>
            <TableColLabel>Created date</TableColLabel>
            <TableColLabel>State</TableColLabel>
          </TableRow>
        </TableHead>
        <tbody>
        {
          this.props.log.map(
            trans => <TransactionLogTR key={trans.id} transaction={trans} />,
          )
        }
        </tbody>
      </Table>
    )
  }
}
