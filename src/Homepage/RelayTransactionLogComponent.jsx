import React, {Component} from 'react';
import { QueryRenderer } from 'react-relay';
import FlatButton from 'material-ui/FlatButton';
import environment from '../environment';
import Spinner from '../components/Spinner';
import { app } from '../localconf';
import {graphql} from 'react-relay';
import { Table, TableHead, TableRow, TableColLabel, TableCell } from "./style";


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
          {(trans.state === 'SUCCEEDED' && <FlatButton backgroundColor="#00ee00" hoverColor="#00ee00" label={trans.state} />)
            || (trans.state === 'FAILED' && <FlatButton backgroundColor="#ff0000" hoverColor="#ff0000" label={trans.state} />)
            || (trans.state === 'PENDING' && <FlatButton backgroundColor="#ffcc00" hoverColor="#ffcc00" label={trans.state} />)
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
          {(trans.state === 'SUCCEEDED' && <FlatButton backgroundColor="#00ee00" hoverColor="#00ee00" label={trans.state} />)
          || (trans.state === 'FAILED' && <FlatButton backgroundColor="#ff0000" hoverColor="#ff0000" label={trans.state} />)
          || (trans.state === 'PENDING' && <FlatButton backgroundColor="#ffcc00" hoverColor="#ffcc00" label={trans.state} />)
          }
        </TableCell>
      </TableRow>);
  }
}

export class TransactionLogTable extends React.Component {
  render() {
    return (
      <div>
        <h5>Latest transactions</h5>
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
