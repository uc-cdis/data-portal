import { fetchQuery, graphql } from 'relay-runtime';
import environment from '../environment';
import getReduxStore from '../reduxStore';

const updateRedux = async transactionList => getReduxStore().then(
  (store) => {
    const homeState = store.getState().homepage || {};
    if (homeState) {
      store.dispatch({ type: 'RECEIVE_TRANSACTION_LIST', data: transactionList });
      return 'dispatch';
    }
    return 'NOOP';
  },
  () => {},
);

const updateReduxError = async error => getReduxStore().then(
  (store) => {
    store.dispatch({ type: 'RECEIVE_RELAY_FAIL', data: error });
  },
);

const getTransactionList = () => {
  const query = graphql`query relayerTransactionLogComponentQuery {
      transactionList: transaction_log (last:20) {
          id
          submitter
          project_id
          created_datetime
          documents {
            doc_size
            doc
          }
          state
      }
  }`;
  fetchQuery(environment, query, {})
    .then(
      (data) => {
        const transactionList = data.transactionList;
        updateRedux(transactionList);
      },
      (error) => {
        updateReduxError(error);
      },
    );
};

export default getTransactionList;
