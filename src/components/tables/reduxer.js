import { connect } from 'react-redux';
import ProjectTable from './ProjectTable';

const ReduxProjectTable = (() => {
  const mapStateToProps = (state) => ({
    userAuthMapping: state.userAuthMapping,
  });

  return connect(mapStateToProps)(ProjectTable);
})();

export default ReduxProjectTable;
