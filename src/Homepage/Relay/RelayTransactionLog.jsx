import React, { Component } from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import PropTypes from 'prop-types';
import environment from '../../environment';
import Spinner from '../../components/Spinner';
import TransactionLogTable from '../components/TransactionLogTable';

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

RelayTransactionLog.PropTypes = {
  transaction_list: PropTypes.object.isRequired,
};

export default RelayTransactionLog;
