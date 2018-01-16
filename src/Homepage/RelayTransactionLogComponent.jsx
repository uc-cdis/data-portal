import React, {Component} from 'react';
import { QueryRenderer } from 'react-relay';
import environment from '../environment';
import Spinner from '../components/Spinner';
import { app } from '../localconf';
import {graphql} from 'react-relay';
import { Table, TableHead, TableRow, TableColLabel, TableCell, ColorSpan } from "./style";
import styled from "styled-components";

const SuccessBar = styled(ColorSpan)`
  background-color: '#00ee00';
`;

const FailBar = styled(ColorSpan)`
  background-color: '#ff0000';
`;

const PendingBar = styled(ColorSpan)`
  background-color: '#ffcc00';
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

const getLocalTime = (gmtTimeString) => {
  let date = new Date(gmtTimeString);
  let offsetMins = date.getTimezoneOffset();
  let offsetHous = -offsetMins/60;
  return date.toLocaleString() + ' UTC' + ((offsetMins>0) ? '' : '+') + offsetHous;
};

/**
 * Table row component - fills in columns given project property
 */
export class TransactionLogTR extends React.Component {
  render() {
    const trans = this.props.transaction;
    if (this.props.idx % 2 === 1)
      return (<TableRow oddRow>
        <TableCell>{trans.id}
        </TableCell>
        <TableCell>{trans.project_id}
        </TableCell>
        <TableCell>{getLocalTime(trans.created_datetime)}
        </TableCell>
        <TableCell>
          {(trans.state === 'SUCCEEDED' && <ColorSpan >{trans.state}</ColorSpan>)
          || (trans.state === 'FAILED' && <FailBar>{trans.state}</FailBar>)
          || (trans.state === 'PENDING' && <PendingBar>{trans.state}</PendingBar>)
          }
        </TableCell>
      </TableRow>);
    else
      return (<TableRow>
        <TableCell>{trans.id}
        </TableCell>
        <TableCell>{trans.project_id}
        </TableCell>
        <TableCell>{getLocalTime(trans.created_datetime)}
        </TableCell>
        <TableCell>
          {(trans.state === 'SUCCEEDED' && <SuccessBar >{trans.state}</SuccessBar>)
          || (trans.state === 'FAILED' && <FailBar>{trans.state}</FailBar>)
          || (trans.state === 'PENDING' && <PendingBar>{trans.state}</PendingBar>)
          }
        </TableCell>
      </TableRow>);
  }
}

export class TransactionLogTable extends React.Component {
  render() {
    return (
      <div>
        <h5>Recent submissions</h5>
        <Table>
          <TableHead>
            <TableRow key='header'>
              <TableColLabel>Id</TableColLabel>
              <TableColLabel>Project</TableColLabel>
              <TableColLabel>Created date</TableColLabel>
              <TableColLabel>State</TableColLabel>
            </TableRow>
          </TableHead>
          <tbody>
          {
            this.props.log.map(
              (trans, i) => <TransactionLogTR key={i} idx={i} transaction={trans} />,
            )
          }
          </tbody>
        </Table>
      </div>
    )
  }
}
