import { connect } from 'react-redux';
import TransactionLogTable from '../components/tables/TransactionLogTable';

const ReduxTransaction = (() => {
  const mapStateToProps = (state) => {
    if (state.submission && state.submission.transactions) {
      return {
        log: state.submission.transactions,
        userAuthMapping: state.userAuthMapping,
      };
    }

    return { log: [], userAuthMapping: state.userAuthMapping };
  };

  // Table does not dispatch anything
  const mapDispatchToProps = null;

  return connect(mapStateToProps, mapDispatchToProps)(TransactionLogTable);
})();

export default ReduxTransaction;
