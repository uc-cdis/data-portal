import { connect } from 'react-redux';
import TransactionLogTable from '../components/tables/TransactionLogTable';

const ReduxTransaction = (() => {
  /** @param {{ submission: import('./types').SubmissionState }} state */
  const mapStateToProps = (state) => ({
    log: state.submission?.transactions ?? [],
  });
  return connect(mapStateToProps)(TransactionLogTable);
})();

export default ReduxTransaction;
