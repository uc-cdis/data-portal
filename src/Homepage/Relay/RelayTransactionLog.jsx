import React, { Component } from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import environment from '../../environment';
import Spinner from '../../components/Spinner';
import TransactionLogTable from '../Redux/TransactionLogTable';

class RelayTransactionLog extends Component {
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
        ({ error, prop }) => {
          if (error) {
            return <div>{error.message}</div>;
          } else if (prop && prop.transaction_list) {
            return <TransactionLogTable log={prop.transaction_list} />;
          }
          return <Spinner />;
        }
      }
    />);
  }
}

export default RelayTransactionLog;
