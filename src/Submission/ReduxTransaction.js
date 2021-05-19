import { connect } from 'react-redux';
import TransactionLogTable from '../components/tables/TransactionLogTable';

const ReduxTransaction = (() => {
  const mapStateToProps = (state) => {
    return { log: state.submission?.transactions ?? [] };
  };
  return connect(mapStateToProps)(TransactionLogTable);
})();

export default ReduxTransaction;
